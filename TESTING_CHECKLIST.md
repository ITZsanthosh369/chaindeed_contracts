# ChainDeed v2.0 Testing Checklist

**Testing Date**: October 24, 2025  
**Contract Address**: 0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f  
**Owner Wallet**: 0x741852dFee8D5a286ea2B40e3cc2Fd42dfbe5362  
**Network**: Sepolia Testnet  
**Dev Server**: http://localhost:3001

---

## Critical Fixes Completed ✅

### 1. ABI Mismatch Fix
- **Issue**: `contract.requestMint is not a function` error
- **Root Cause**: Frontend using old v1.0 ABI (147 lines, only safeMint)
- **Solution**: Replaced `abi.ts` with v2.0 ABI from compilation (994 lines)
- **Verification**: `grep "requestMint" abi.ts` shows 2 matches at line 783
- **Status**: ✅ COMPLETED

### 2. Role-Based Dashboards
- **Issue**: "need two types of dashboard...for admin and users"
- **Solution**: Implemented conditional rendering in `page.tsx` based on `isOwner`
- **Admin Dashboard**: Shows pending requests count, admin shortcuts, contract info
- **User Dashboard**: Shows request count, NFT balance, how-it-works guide
- **Status**: ✅ COMPLETED

---

## Test Scenarios

### Test 1: Landing Page (Not Connected) ⏳

**Steps**:
1. Open http://localhost:3001
2. Ensure wallet is NOT connected

**Expected Results**:
- [ ] Hero section shows "Welcome to ChainDeed"
- [ ] Yellow banner prompts to connect MetaMask
- [ ] Features section displays 3 cards (Secure, Fast, Transparent)
- [ ] Contract information section shows network & address
- [ ] No errors in browser console

**Actual Results**:
- [ ] Test not performed yet

---

### Test 2: User Dashboard (Regular Wallet) ⏳

**Steps**:
1. Connect with regular wallet (NOT owner)
2. Check home page renders correctly

**Expected Results**:
- [ ] Page title: "Welcome to ChainDeed"
- [ ] 2 stat cards: "My Requests" and "My Certificates"
- [ ] "Request New Certificate" button visible
- [ ] "How It Works" 3-step guide displayed
- [ ] Navbar shows: Home, Request Certificate, My Requests, My Deeds
- [ ] Navbar does NOT show: Direct Mint, ⭐Admin

**Actual Results**:
- [ ] Test not performed yet

---

### Test 3: Admin Dashboard (Owner Wallet) ⏳

**Steps**:
1. Connect with owner wallet: 0x741852dFee8D5a286ea2B40e3cc2Fd42dfbe5362
2. Check home page renders correctly

**Expected Results**:
- [ ] Page title: "Admin Dashboard"
- [ ] Subtitle: "Welcome back, Contract Owner"
- [ ] 3 stat cards: Pending Requests, My NFTs, Contract Address
- [ ] "Review Pending Requests" button with count badge
- [ ] "Direct Mint (Legacy)" button
- [ ] Contract info shows role: "Contract Owner"
- [ ] Navbar shows: Home, Request Certificate, My Requests, My Deeds, Direct Mint, ⭐Admin

**Actual Results**:
- [ ] Test not performed yet

---

### Test 4: IPFS Upload (Working - User Confirmed) ✅

**Steps**:
1. Navigate to /request
2. Upload a test file (PDF/image)
3. Fill in certificate details

**Expected Results**:
- [x] File uploads successfully to Pinata
- [x] IPFS URL returned
- [x] No errors during upload

**Actual Results**:
- [x] User confirmed: "file is uploading successfully to pinata cloud"
- [x] IPFS integration working

---

### Test 5: Request Submission (CRITICAL - ABI Fix Test) ⏳

**Steps**:
1. Connect regular wallet
2. Navigate to /request
3. Upload test file
4. Enter name: "Test Certificate"
5. Enter description: "Testing v2.0 request system"
6. Click "Submit Request"

**Expected Results**:
- [ ] File uploads to IPFS successfully
- [ ] Transaction prompt from MetaMask
- [ ] Transaction confirms on blockchain
- [ ] Success message: "Request submitted!"
- [ ] NO ERROR: "contract.requestMint is not a function"
- [ ] Redirect to /my-requests

**Actual Results**:
- [ ] Test not performed yet
- [ ] **THIS IS THE CRITICAL TEST** - validates ABI fix

**Console Logs to Monitor**:
```
✅ Should see: "Uploading to IPFS..."
✅ Should see: "IPFS URL: ipfs://..."
✅ Should see: "Submitting request to blockchain..."
✅ Should see: "Request ID: [number]"
❌ Should NOT see: "contract.requestMint is not a function"
```

---

### Test 6: Request Tracking ⏳

**Steps**:
1. After submitting request in Test 5
2. Navigate to /my-requests
3. View submitted request

**Expected Results**:
- [ ] Request appears in list
- [ ] Status badge shows "Pending" (yellow)
- [ ] Shows request ID, timestamp
- [ ] "View on IPFS" link works
- [ ] Metadata loads from IPFS

**Actual Results**:
- [ ] Test not performed yet

---

### Test 7: Admin Approval Flow ⏳

**Steps**:
1. Switch to owner wallet: 0x741852dFee8D5a286ea2B40e3cc2Fd42dfbe5362
2. Navigate to /admin
3. View pending request from Test 5
4. Click "Approve" button
5. Confirm MetaMask transaction

**Expected Results**:
- [ ] Pending request visible in list
- [ ] Request details show in right panel
- [ ] IPFS metadata preview loads
- [ ] Approve button triggers MetaMask
- [ ] Transaction confirms
- [ ] Request disappears from pending list
- [ ] Success message displayed

**Actual Results**:
- [ ] Test not performed yet

---

### Test 8: NFT Minting Verification ⏳

**Steps**:
1. Switch back to regular user wallet
2. Navigate to /my-deeds
3. Check for newly minted NFT

**Expected Results**:
- [ ] New NFT appears in grid
- [ ] Shows certificate image from IPFS
- [ ] Shows certificate name and description
- [ ] "View on IPFS" link works
- [ ] Token ID displayed
- [ ] Owned by current wallet address

**Actual Results**:
- [ ] Test not performed yet

---

### Test 9: Admin Rejection Flow ⏳

**Steps**:
1. Submit another request with user wallet
2. Switch to owner wallet
3. Navigate to /admin
4. Click "Reject" on new request
5. Enter rejection reason
6. Confirm transaction

**Expected Results**:
- [ ] Rejection reason modal appears
- [ ] Transaction confirms
- [ ] Request status changes to "Rejected"
- [ ] Switch to user wallet
- [ ] /my-requests shows status "Rejected" (red)
- [ ] Rejection reason visible
- [ ] No NFT minted

**Actual Results**:
- [ ] Test not performed yet

---

### Test 10: Direct Mint (Legacy Function) ⏳

**Steps**:
1. Connect owner wallet
2. Navigate to /mint
3. Enter recipient address
4. Upload file to IPFS
5. Click "Mint NFT"

**Expected Results**:
- [ ] Page loads without errors
- [ ] Can upload to IPFS
- [ ] Can call safeMint function
- [ ] Transaction confirms
- [ ] NFT minted to recipient

**Actual Results**:
- [ ] Test not performed yet

---

## Known Issues

### Fixed Issues ✅
1. **contract.requestMint is not a function** - FIXED by updating ABI
2. **No role-based dashboards** - FIXED by implementing conditional rendering

### Potential Issues to Monitor
1. Gas estimation errors (monitor during approval/rejection)
2. IPFS gateway timeouts (Pinata rate limits)
3. MetaMask network switching
4. Request ID event parsing
5. Token balance loading delays

---

## Environment Verification

### Contract Configuration
- [x] Contract address in .env.local: 0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f
- [x] Network: Sepolia (Chain ID: 11155111)
- [x] ABI version: v2.0 (994 lines)

### IPFS Configuration
- [x] Pinata API Key: 7dbe2184e02920937ef6
- [x] Pinata JWT: Configured in .env.local
- [x] Gateway URL: https://gateway.pinata.cloud/ipfs/

### Wallet Configuration
- [x] Owner private key in backend .env
- [x] Owner address: 0x741852dFee8D5a286ea2B40e3cc2Fd42dfbe5362
- [x] Test wallets have Sepolia ETH

---

## Test Execution Order

**RECOMMENDED SEQUENCE**:
1. Test 1: Landing page (verify base UI)
2. Test 3: Admin dashboard (verify owner detection)
3. Test 2: User dashboard (verify role separation)
4. **Test 5: Request submission (CRITICAL - validates ABI fix)**
5. Test 6: Request tracking (verify data flow)
6. Test 7: Admin approval (verify complete workflow)
7. Test 8: NFT minting verification (verify end-to-end)
8. Test 9: Rejection flow (verify negative path)
9. Test 10: Direct mint (verify legacy compatibility)

---

## Success Criteria

### Must Pass (Critical)
- [ ] Test 5: Request submission works without "requestMint is not a function" error
- [ ] Test 7: Admin can approve requests
- [ ] Test 8: NFT mints to user wallet after approval
- [ ] Test 2 & 3: Correct dashboards show for each role

### Should Pass (Important)
- [ ] Test 6: Request tracking displays correct status
- [ ] Test 9: Admin can reject requests with reason
- [ ] Test 1: Landing page looks professional
- [ ] Navbar shows correct options per role

### Nice to Have
- [ ] Test 10: Direct mint still works for legacy use
- [ ] All IPFS links load quickly
- [ ] No console errors anywhere

---

## Manual Testing Notes

**Tester**: _________________  
**Date**: _________________  
**Browser**: _________________  
**MetaMask Version**: _________________

**Additional Observations**:
```
[Space for tester notes]
```

---

## Deployment Readiness

Before deploying to production:
- [ ] All critical tests pass
- [ ] No console errors
- [ ] Contract verified on Etherscan
- [ ] IPFS gateway responsive
- [ ] Gas costs reasonable
- [ ] Mobile responsive testing
- [ ] Error handling tested (network failures, rejected transactions)
- [ ] README updated with deployment info

---

**Status**: 🔄 Testing In Progress  
**Next Action**: Execute Test 1 (Landing Page)  
**Deadline**: October 24, 2025 ⏰
