const express = require('express');
const {pipe, prop, map, dissoc, slice, propEq, find, pick} = require('ramda');
const app = express();
app.use(express.json());

const data = {
  config: {},
  builds: []
};
const baseUrl = '/config';
app.get(baseUrl, (req, res) => {
  res.send(!!data.config.id ? {
    data: data.config
  } : {});
  res.end();
});
app.post(baseUrl, (req, res) => {
  data.config = {
    id: Math.floor(Math.random() * 1000),
    ...req.body
  };
  res.end();
});
app.delete(baseUrl, (req, res) => {
  data.builds = [];
  data.config = {};
  res.end();
});

const baseBuildUrl = '/build';


app.get(`${baseBuildUrl}/list`, (req, res) => {
  const {offset = 0, limit} = req.query;
  res.send({
    data: pipe(
        prop('builds'),
        slice(
            offset,
            limit ?
              (Number.parseInt(offset) + Number.parseInt(limit)) :
              Infinity
        ),
        map(dissoc('buildLog'))
    )(data)
  });
});

app.get(`${baseBuildUrl}/log`, (req, res) => {
  res.send(pipe(
      prop('builds'),
      find(propEq('id', req.query.buildId)),
      prop('buildLog')
  )(data));
});
app.get(`${baseBuildUrl}/details`, (req, res) => {
  res.send({
    data: pipe(
        prop('builds'),
        find(propEq('id', req.query.buildId)),
        dissoc('buildLog')
    )(data)
  });
});

app.post(`${baseBuildUrl}/request`, (req, res) => {
  const id = `IDn${data.builds.length + 1}`;
  data.builds.push({
    ...req.body,
    id,
    'configurationId': data.config.id,
    'buildNumber': data.builds.length + 1,
    'status': 'Waiting'
  });

  res.send({
    'data': pipe(
        prop('builds'),
        find(propEq('id', id)),
        pick(['id', 'buildNumber', 'status'])
    )(data)
  });
});

app.post(`${baseBuildUrl}/start`, ({body}, res) => {
  const {buildId, dateTime} = body;
  const build = data.builds.find(({id}) => id === buildId);
  build.status = 'InProgress';
  build.start = dateTime;
  res.end();
});

app.post(`${baseBuildUrl}/finish`, ({body}, res) => {
  const {buildId, duration, success, buildLog} = body;
  const build = data.builds.find(({id}) => id === buildId);
  build.status = success ? 'Success' : 'Fail';
  build.duration = duration;
  build.buildLog = buildLog;
  res.end();
});

app.listen(3003);
