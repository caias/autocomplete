class CommonParser {
  onHandleCode(ev) {
    ev.data.code = ev.data.code
      .replace(/module\.exports = /g, 'export default ');
  }
}

module.exports = new CommonParser();