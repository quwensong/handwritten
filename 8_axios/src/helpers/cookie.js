const cookie = {
  read(name) {
    // 通过正则去匹配相应的 cookie
    const match = document.cookie.match(
      new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
    );
    return match ? decodeURIComponent(match[3]) : null;
  },
};

export default cookie;
