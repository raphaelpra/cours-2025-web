const baseDir = new URL("./", import.meta.url).pathname;

const MIME: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
};

function getMime(path: string): string {
    const ext = path.slice(path.lastIndexOf("."));
    return MIME[ext] ?? "application/octet-stream";
}

const server = Bun.serve({
    port: 3000,
    async fetch(request) {
        const url = new URL(request.url);
        let pathname = url.pathname === "/" ? "/slides1.html" : url.pathname;
        const filePath = baseDir + pathname.slice(1);
        const file = Bun.file(filePath);

        if (!(await file.exists())) {
            return new Response("Not found", { status: 404 });
        }

        return new Response(file, {
            headers: { "Content-Type": getMime(pathname) },
        });
    },
});

console.log(`Slides server running on ${server.url}`);
console.log(`Open ${server.url}slides1.html`);
console.log(`Open ${server.url}slides-annexe.html`);
