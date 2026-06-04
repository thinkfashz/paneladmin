import { describe, it, expect } from "vitest";
import { getActivityIpFromHeaders, maskActivityIp, hashActivityIp } from "./ip";

describe("getActivityIpFromHeaders", () => {
  it("extracts from x-forwarded-for with single IP", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "192.168.1.1");
    expect(getActivityIpFromHeaders(headers)).toBe("192.168.1.1");
  });

  it("extracts from x-forwarded-for with multiple IPs", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "192.168.1.1, 10.0.0.1, 127.0.0.1");
    expect(getActivityIpFromHeaders(headers)).toBe("192.168.1.1");
  });

  it("extracts from x-real-ip if x-forwarded-for is missing", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "10.0.0.2");
    expect(getActivityIpFromHeaders(headers)).toBe("10.0.0.2");
  });

  it("extracts from cf-connecting-ip if others are missing", () => {
    const headers = new Headers();
    headers.set("cf-connecting-ip", "172.16.0.1");
    expect(getActivityIpFromHeaders(headers)).toBe("172.16.0.1");
  });

  it("returns null if no known IP headers are present", () => {
    const headers = new Headers();
    expect(getActivityIpFromHeaders(headers)).toBeNull();
  });
});

describe("maskActivityIp", () => {
  it("masks a valid IPv4 address", () => {
    expect(maskActivityIp("192.168.1.100")).toBe("192.168.1.0");
    expect(maskActivityIp("10.0.0.5")).toBe("10.0.0.0");
    expect(maskActivityIp("127.0.0.1")).toBe("127.0.0.0");
  });

  it("returns 'masked' for IPv6 addresses", () => {
    expect(maskActivityIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("masked");
    expect(maskActivityIp("::1")).toBe("masked");
  });

  it("returns 'masked' for invalid string formats", () => {
    expect(maskActivityIp("not-an-ip")).toBe("masked");
    expect(maskActivityIp("192.168.1")).toBe("masked");
    expect(maskActivityIp("192.168.1.1.1")).toBe("masked");
  });

  it("returns null for null or undefined input", () => {
    expect(maskActivityIp(null)).toBeNull();
    expect(maskActivityIp(undefined)).toBeNull();
    expect(maskActivityIp("")).toBeNull();
  });
});

describe("hashActivityIp", () => {
  it("returns null for null or undefined input", async () => {
    expect(await hashActivityIp(null)).toBeNull();
    expect(await hashActivityIp(undefined)).toBeNull();
    expect(await hashActivityIp("")).toBeNull();
  });
});
