import asyncio
from playwright.async_api import async_playwright

BASE = "http://localhost:8123"
PAGES = [
    ("/", "home"),
    ("/works/calling-a-deer-a-horse/", "cadah"),
    ("/works/the-stranger/", "stranger"),
    ("/works/saint-sebastian/", "sebastian"),
]
VIEWPORTS = [("desktop", 1440, 900), ("mobile", 390, 844)]

async def scroll_through(page):
    height = await page.evaluate("document.body.scrollHeight")
    vh = await page.evaluate("window.innerHeight")
    y = 0
    while y < height:
        await page.evaluate(f"window.scrollTo(0, {y})")
        await page.wait_for_timeout(120)
        y += vh
        height = await page.evaluate("document.body.scrollHeight")
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(150)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        for vname, w, h in VIEWPORTS:
            page = await browser.new_page(viewport={"width": w, "height": h})
            for path, name in PAGES:
                await page.goto(BASE + path, wait_until="networkidle")
                await scroll_through(page)
                await page.screenshot(path=f"/home/claude/_shots2/{vname}_{name}.png", full_page=True)
                print("shot:", vname, name)
            await page.close()
        await browser.close()

asyncio.run(main())
