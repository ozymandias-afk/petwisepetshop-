export default function proxy(request: Request) {
  return new Response("Proxy is working!", { status: 200 });
}
