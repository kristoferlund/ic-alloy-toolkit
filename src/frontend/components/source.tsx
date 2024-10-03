export default function Source({ file }: { file: string }) {
  return <div className="source">
    <img src='/rust.svg' />
    <a href={`https://github.com/kristoferlund/ic-alloy-demo/blob/main/src/backend/src/service/${file}`} target="_blank" rel="noreferrer">{file}</a>
  </div>
}
