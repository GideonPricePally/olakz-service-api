export default async function getIpCountry(ip: string): Promise<{ name: string; country_3: string; ip: string; country: string }> {
  const defaultResponse = { name: 'Nigeria', country_3: 'NGA', ip, country: 'NG' };
  const res = ip.includes('::1') ? defaultResponse : defaultResponse;
  return { name: defaultResponse.name, country_3: defaultResponse.country_3, ip, country: defaultResponse.country?.toLowerCase() };
}
