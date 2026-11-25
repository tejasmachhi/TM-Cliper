"""
Comprehensive Mock Test Suite for TM Cliper
Verifies end-to-end functionality across all core SaaS APIs.
"""
import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api"

def request_json(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {"error": err_body}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    print("=" * 60)
    print("🚀 TM CLIPER — END-TO-END SYSTEM TEST SUITE")
    print("=" * 60)

    passed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] {name} {details}")
        else:
            print(f"  [FAIL] {name} - {details}")

    # 1. System Health Status
    status_code, res = request_json("/system/status")
    assert_test("1. Health Status", status_code == 200 and res.get("status") == "online", f"(status={res.get('status')})")

    # 2. Auth Login (Seed Account)
    status_code, res = request_json("/auth/login", method="POST", data={
        "email": "creator@tmcliper.ai",
        "password": "admin123"
    })
    token = res.get("token") or res.get("access_token")
    assert_test("2. User Authentication (Login)", status_code == 200 and bool(token), f"(token={token[:12]}...)")

    # 3. Auth Profile (/api/auth/me)
    status_code, res = request_json("/auth/me", token=token)
    user_name = res.get("user", {}).get("name") or res.get("name")
    assert_test("3. User Profile Verification", status_code == 200 and "TM Cliper" in user_name or "Creator" in user_name, f"(user={user_name})")

    # 4. YouTube Metadata Preview
    status_code, res = request_json("/youtube/preview", method="POST", data={
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }, token=token)
    metadata = res.get("metadata", {})
    assert_test("4. YouTube Metadata Preview", status_code == 200 and bool(metadata.get("title")), f"(title={metadata.get('title')[:30]}...)")

    # 5. Project Creation
    status_code, res = request_json("/projects/create", method="POST", data={
        "source_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "source_type": "youtube",
        "project_name": "Rick Astley Viral Shorts",
        "confirmed_rights": True,
        "aspect_ratio": "9:16",
        "min_clips": 6,
        "target_duration": 30,
        "download_source": True
    }, token=token)
    project_id = res.get("project_id")
    assert_test("5. Project Creation & Queueing", status_code == 200 and bool(project_id), f"(project_id={project_id})")

    # 6. Projects Listing
    status_code, res = request_json("/projects", token=token)
    projects = res.get("projects", [])
    assert_test("6. Projects Listing", status_code == 200 and len(projects) > 0, f"(count={len(projects)})")

    # 7. Clips Retrieval
    status_code, res = request_json("/clips", token=token)
    clips = res.get("clips", [])
    assert_test("7. AI Highlights & Clips Retrieval", status_code == 200 and isinstance(clips, list), f"(found={len(clips)} clips)")

    # 8. YouTube Integration Settings
    status_code, res = request_json("/youtube/integration", token=token)
    integration = res.get("integration", {})
    assert_test("8. YouTube Channel Integration Status", status_code == 200 and bool(integration), f"(channel={integration.get('channel_title')})")

    # 9. Update YouTube Publishing Preferences
    status_code, res = request_json("/youtube/integration/preferences", method="POST", data={
        "default_title": "{{clip_title}} #Shorts",
        "default_description": "Auto-clipped with TM Cliper",
        "default_tags": "shorts, viral, gaming",
        "default_privacy": "public"
    }, token=token)
    assert_test("9. Publishing Preferences Update", status_code == 200 and (res.get("status") == "success" or res.get("success") is True))

    # 10. YouTube Shorts 1-Click Publishing
    clip_id_to_publish = clips[0]["id"] if clips else "clip-demo-01"
    status_code, res = request_json("/youtube/integration/publish", method="POST", data={
        "clip_id": clip_id_to_publish,
        "title": "Insane AI Highlight #Shorts"
    }, token=token)
    assert_test("10. YouTube Shorts 1-Click Publishing", status_code == 200 and bool(res.get("youtube_url")), f"(url={res.get('youtube_url')})")

    # 11. Billing / Plans ($0 Free Beta)
    status_code, res = request_json("/billing/plans", token=token)
    plans = res.get("plans", [])
    assert_test("11. Free Beta Subscription Verification", status_code == 200 and len(plans) > 0, f"({len(plans)} plans available)")

    print("=" * 60)
    print(f"RESULT: {passed}/{total} TESTS PASSED ({round(passed/total * 100)}%)")
    print("=" * 60)
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
