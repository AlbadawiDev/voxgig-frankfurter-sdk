

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { FrankfurterSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('CoverageEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when FRANKFURTER_TEST_LIVE=TRUE.
  afterEach(liveDelay('FRANKFURTER_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = FrankfurterSDK.test()
    const ent = testsdk.Coverage()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = FrankfurterSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Coverage().load({"base":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.FRANKFURTER_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'coverage.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"base":{"a":true,"h":"Base","n":"base","r":true,"sh":"Requested base currency, EUR by default","t":"`$STRING`","key$":"base","index$":0},"end_date":{"a":true,"fo":"date","h":"End Date","n":"end_date","r":true,"sh":"Last eligible observation date with a nonempty matching rates query","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"end_date","index$":1},"providers":{"a":true,"h":"Providers","n":"providers","r":true,"sh":"Selected providers, or null for the default daily blend","t":["`$ONE`",["`$ARRAY`","`$NULL`"]],"key$":"providers","index$":2},"quotes":{"a":true,"h":"Quotes","n":"quotes","r":true,"sh":"Requested quotes, or null for all","t":["`$ONE`",["`$ARRAY`","`$NULL`"]],"key$":"quotes","index$":3},"start_date":{"a":true,"fo":"date","h":"Start Date","n":"start_date","r":true,"sh":"First eligible observation date with a nonempty matching rates query","t":["`$ONE`",["`$STRING`","`$NULL`"]],"key$":"start_date","index$":4}},"name":"coverage","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /coverage","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"USD","k":"query","n":"base","or":"base","r":false,"t":"`$STRING`","index$":0},{"a":true,"ex":"ECB,TCMB","k":"query","n":"provider","or":"providers","r":false,"t":"`$STRING`","index$":1},{"a":true,"ex":"USD,GBP,JPY","k":"query","n":"quote","or":"quotes","r":false,"t":"`$STRING`","index$":2}]},"k":"http","m":"GET","o":"/coverage","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"coverage"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"coverage","name__orig":"coverage","Name":"Coverage","name_":"coverage","name-":"coverage","NAME":"COVERAGE","index$":0}, {"active":true,"entity":"coverage","key$":"BasicCoverageFlow","kind":"basic","name":"BasicCoverageFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"coverage_ref01","srcdatavar":"coverage_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-coverage_ref01"}}]}]}, 'Coverage', {"GET /coverage":{"protocol":"http","parameters":[{"name":"base","in":"query","description":"Base currency (default: EUR)","required":false,"schema":{"type":"string","default":"EUR","example":"USD"},"x-ref":"#/components/parameters/base","index$":0},{"name":"quotes","in":"query","description":"Comma-separated list of quote currencies to include","required":false,"schema":{"type":"string","example":"USD,GBP,JPY"},"x-ref":"#/components/parameters/quotes","index$":1},{"name":"providers","in":"query","description":"Comma-separated list of data providers to include. A single provider includes its stored non-currency series. Selecting multiple providers blends only registered currencies and accounting units.","required":false,"schema":{"type":"string","example":"ECB,TCMB"},"x-ref":"#/components/parameters/providers","index$":2}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let coverage_ref01_data = Object.values(setup.data.existing.coverage)[0] as any

    // LOAD
    const coverage_ref01_ent = client.Coverage()
    const coverage_ref01_match_dt0: any = {}
    const coverage_ref01_data_dt0 = (await coverage_ref01_ent.load(coverage_ref01_match_dt0)).data()
    assert(null != coverage_ref01_data_dt0)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/coverage/CoverageTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = FrankfurterSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['coverage01','coverage02','coverage03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'FRANKFURTER_TEST_COVERAGE_ENTID': idmap,
    'FRANKFURTER_TEST_LIVE': 'FALSE',
    'FRANKFURTER_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['FRANKFURTER_TEST_COVERAGE_ENTID']

  const live = 'TRUE' === env.FRANKFURTER_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['FRANKFURTER_TEST_COVERAGE_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new FrankfurterSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.FRANKFURTER_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
