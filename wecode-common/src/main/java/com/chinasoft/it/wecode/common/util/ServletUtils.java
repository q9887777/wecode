package com.chinasoft.it.wecode.common.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet 工具类
 * @author Administrator
 *
 */
public class ServletUtils {

  /**
   * 获取访问用户的IP
   * @param request 请求对象
   * @return 请求者的IP
   */
  public static String getRemoteAddr(HttpServletRequest request) {
    String ip = request.getHeader("x-forwarded-for");
    if (StringUtil.emptyOrIgnoreCaseEquals(ip, "unknown")) {
      ip = request.getHeader("Proxy-Client-IP");
    }
    if (StringUtil.emptyOrIgnoreCaseEquals(ip, "unknown")) {
      ip = request.getHeader("WL-Proxy-Client-IP");
    }
    if (StringUtil.emptyOrIgnoreCaseEquals(ip, "unknown")) {
      ip = request.getHeader("HTTP_CLIENT_IP");
    }
    if (StringUtil.emptyOrIgnoreCaseEquals(ip, "unknown")) {
      ip = request.getHeader("HTTP_X_FORWARDED_FOR");
    }
    if (StringUtil.emptyOrIgnoreCaseEquals(ip, "unknown")) {
      ip = request.getRemoteAddr();
    }
    return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;
  }

  /**
   * 获取请求头
   * @param req
   * @param exclustions
   * @return
   */
  public static Map<String, String> getHeader(HttpServletRequest req, String... exclustions) {
    Map<String, String> result = new HashMap<>();
    List<String> exclustionList = Arrays.asList(exclustions == null ? new String[0] : exclustions);
    Enumeration<String> headerNames = req.getHeaderNames();
    while (headerNames.hasMoreElements()) {
      String name = headerNames.nextElement();
      if (!exclustionList.contains(name)) {
        result.put(name, req.getHeader(name));
      }
    }
    return result;
  }

  public static void write(HttpServletResponse resp, String value, int statusCode) throws UnsupportedEncodingException, IOException {
    resp.setHeader("Content-type", "text/html;charset=UTF-8");
    resp.setStatus(statusCode);
    if (!StringUtil.isEmpty(value)) {
      resp.getOutputStream().write(value.getBytes("utf-8"));
    }
  }

}
