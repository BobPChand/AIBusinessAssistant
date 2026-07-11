import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// ─── Replace these with your RevenueCat API keys ─────────────────────────────
// iOS key: found in RevenueCat Dashboard → Project → API Keys → iOS
// Android key: found in RevenueCat Dashboard → Project → API Keys → Android
const REVENUECAT_IOS_KEY = 'test_HgrFwjJlIfzSkEmVgtLZoyqXsMl';
const REVENUECAT_ANDROID_KEY = 'PASTE_YOUR_ANDROID_PUBLIC_KEY_HERE';

// The entitlement identifier you created in RevenueCat dashboard
export const ENTITLEMENT_PRO = 'pro';

/**
 * Call this once at app startup (in App.js useEffect)
 */
export const initializeRevenueCat = async () => {
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    const apiKey = Platform.select({
      ios: REVENUECAT_IOS_KEY,
      android: REVENUECAT_ANDROID_KEY,
    });
    await Purchases.configure({ apiKey });
    console.log('RevenueCat initialized');
  } catch (e) {
    console.error('RevenueCat init error:', e);
  }
};

/**
 * Fetch the current Offering from RevenueCat.
 * Returns the offering object (with .availablePackages array) or null.
 */
export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
      return offerings.current;
    }
    return null;
  } catch (e) {
    console.error('RevenueCat getOfferings error:', e);
    return null;
  }
};

/**
 * Purchase a package returned from getOfferings().
 * Returns { success, isActive, cancelled }
 */
export const purchasePackage = async (pkg) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isActive = customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
    return { success: true, isActive, cancelled: false };
  } catch (e) {
    if (e.userCancelled) {
      return { success: false, isActive: false, cancelled: true };
    }
    throw e;
  }
};

/**
 * Restore previous purchases (required button by Apple).
 * Returns { success, isActive }
 */
export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isActive = customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
    return { success: true, isActive };
  } catch (e) {
    throw e;
  }
};

/**
 * Check if the current user has an active Pro entitlement.
 * Returns boolean.
 */
export const checkSubscriptionStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
  } catch (e) {
    console.error('RevenueCat checkStatus error:', e);
    return false;
  }
};
