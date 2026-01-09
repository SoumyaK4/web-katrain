import time
from playwright.sync_api import sync_playwright

def verify_navigation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Wait for dev server to be ready
        time.sleep(3)

        try:
            page.goto("http://localhost:5173")

            # 1. Play some moves
            # Click at (3,3) - D16
            # Board is ~ 600x600.
            # We can use the text coordinates? Or just click somewhat precisely.
            # The board element has coordinate labels.
            # Let's find the board container.

            # Just wait for board to appear
            page.wait_for_selector(".relative.bg-\\[\\#DCB35C\\]")

            # Click some spots
            # Center is roughly 300, 300
            board = page.locator(".relative.bg-\\[\\#DCB35C\\]")
            board_box = board.bounding_box()

            if board_box:
                # Move 1: Black
                page.mouse.click(board_box["x"] + 100, board_box["y"] + 100)
                time.sleep(0.5)

                # Move 2: White
                page.mouse.click(board_box["x"] + 200, board_box["y"] + 100)
                time.sleep(0.5)

                # Move 3: Black
                page.mouse.click(board_box["x"] + 100, board_box["y"] + 200)
                time.sleep(0.5)

            # Check if Prev/Next buttons exist
            page.get_by_text("Prev").click()
            time.sleep(0.5)

            # Take screenshot of navigated state (should see one less stone, or indicator)
            page.screenshot(path="verification/verification.png")
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_navigation()
