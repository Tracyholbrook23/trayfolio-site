import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const localRequire = (name) => name.startsWith('@/') ? load(path.resolve('src', name.slice(2) + '.ts')) : require(name);
  new Function('require', 'module', 'exports', js)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
// All upstream requests are stubbed: these tests cannot send mail or take payments.
process.env.STRIPE_SECRET_KEY = 'test-only-not-a-real-key';
process.env.WEB3FORMS_ACCESS_KEY = 'test-only-not-a-real-key';
const originalFetch = globalThis.fetch;
let upstreamCalls = [];
globalThis.fetch = async (url, options) => {
  upstreamCalls.push({ url, options });
  return Response.json(url.includes('stripe.com') ? {url:'https://checkout.stripe.com/test-only'} : url.includes('resend.com') ? {id:'test-email'} : {success:true});
};
const contact = load(path.resolve('src/app/api/contact/route.ts')).POST;
const checkout = load(path.resolve('src/app/api/checkout/route.ts')).POST;
let checks = 0;
let ip = 0;
function request(body, headers = {}, raw = false) {
  return new Request('https://www.trayfolio.net/api/contact', {method:'POST', headers:{'content-type':'application/json', 'x-forwarded-for':`192.0.2.${++ip}`, ...headers}, body: raw ? body : JSON.stringify(body)});
}
async function rejects(handler, body, status = 400, headers, raw) {
  const before = upstreamCalls.length;
  const response = await handler(request(body, headers, raw));
  assert.equal(response.status, status, JSON.stringify(body)?.slice(0,80));
  assert.equal(typeof (await response.json()).error, 'string');
  assert.equal(upstreamCalls.length, before, 'Rejected input must never reach a provider');
  checks++;
}
try {
  for (const body of [null, [], 1, 'text', {}, {packageId:'__proto__'}, {packageId:'constructor'}, {kind:'other'}, {packageId:'starter',addOns:{}}, {packageId:'starter',addOns:[null]}, {packageId:'starter',addOns:[{id:'constructor',quantity:1}]}, {packageId:'starter',addOns:[{id:'page',quantity:1.5}]}, {packageId:'starter',addOns:[{id:'form',quantity:-1}]}, {packageId:'starter',addOns:[{id:'page',quantity:41}]}, {packageId:'starter',addOns:[{id:'page',quantity:1},{id:'page',quantity:1}]}]) await rejects(checkout,body);
  const valid = {name:'Audit fixture',email:'audit@example.invalid',phone:'',business:'',message:'Test fixture only',projectType:[],botcheck:''};
  for (const body of [null, [], {}, {...valid,email:'invalid'}, {...valid,name:' '}, {...valid,message:'x'.repeat(3001)}, {...valid,phone:'x'.repeat(41)}, {...valid,business:{}}, {...valid,botcheck:'on'}, {...valid,projectType:['unknown']}, {...valid,projectType:[]}]) {
    if (body && body.name === valid.name && body.email === valid.email && body.message === valid.message && body.phone === '' && body.business === '' && body.botcheck === '' && Array.isArray(body.projectType) && !body.projectType.length) continue;
    await rejects(contact,body);
  }
  for (const handler of [contact,checkout]) {
    await rejects(handler,valid,403,{origin:'https://unrelated.example'});
    await rejects(handler,valid,415,{'content-type':'text/plain'});
    await rejects(handler,'{',400,{},true);
    await rejects(handler,'x'.repeat(16385),413,{},true);
  }
  const good = await contact(request(valid)); assert.equal(good.status,200); checks++;
  const goodCheckout = await checkout(request({packageId:'starter',addOns:[{id:'page',quantity:2}]}));
  assert.equal(goodCheckout.status,200);
  const params = new URLSearchParams(upstreamCalls.at(-1).options.body);
  assert.equal(params.get('line_items[0][price_data][unit_amount]'),'25000'); checks++;
  const forgedPrice = await checkout(request({packageId:'starter',amount:1})); assert.equal(forgedPrice.status,200);
  assert.equal(new URLSearchParams(upstreamCalls.at(-1).options.body).get('line_items[0][price_data][unit_amount]'),'20000'); checks++;
  delete process.env.WEB3FORMS_ACCESS_KEY;
  process.env.RESEND_API_KEY = 'test-only-not-a-real-key';
  process.env.DEMO_EMAIL_FROM = 'Trayfolio <test@example.invalid>';
  assert.equal((await contact(request(valid))).status,200);
  assert.equal(upstreamCalls.at(-1).url,'https://api.resend.com/emails');
  assert.equal(JSON.parse(upstreamCalls.at(-1).options.body).reply_to,valid.email); checks++;
  const before = upstreamCalls.length;
  for(let n=0;n<5;n++) {
    const response=await contact(request(null,{'x-forwarded-for':'198.51.100.200'}));
    assert.equal(response.status,n===4?429:400);
  }
  assert.equal(upstreamCalls.length,before); checks++;
  globalThis.fetch = async () => { throw new Error('Simulated provider outage'); };
  assert.equal((await contact(request(valid))).status,502); checks++;
  console.log(`${checks} submission and checkout checks passed; no external requests made.`);
} finally { globalThis.fetch = originalFetch; }
