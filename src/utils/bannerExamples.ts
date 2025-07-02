// Examples of how the LastUpdatedBanner will look with different scenarios

export const bannerExamples = () => {
  console.log('📱 [BANNER EXAMPLES] How the banner will look:');
  console.log('=============================================');
  console.log('');

  console.log('🟢 Normal fresh data (just updated):');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│ Last updated              just now      │');
  console.log('└─────────────────────────────────────────┘');
  console.log('');

  console.log('🟢 Recent data (5 minutes old):');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│ Last updated         5 minutes ago     │');
  console.log('└─────────────────────────────────────────┘');
  console.log('');

  console.log('🟢 Older data (2 hours old):');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│ Last updated          2 hours ago      │');
  console.log('└─────────────────────────────────────────┘');
  console.log('');

  console.log('🔵 Using cached data:');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│ Showing cached data    3 hours ago     │');
  console.log('└─────────────────────────────────────────┘');
  console.log('');

  console.log('🟡 Rate limited (showing warning):');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│ API rate limited - showing cached data │');
  console.log('│                    1 day ago            │');
  console.log('│ ⚠️ Rate limit reached - data may be    │');
  console.log('│ outdated                                │');
  console.log('└─────────────────────────────────────────┘');
  console.log('');

  console.log('📊 Benefits of the new format:');
  console.log('• Clear "Last updated" label instead of confusing "Live data"');
  console.log('• Smart time formatting (minutes, hours, days)');
  console.log('• Proper grammar (1 minute ago vs 2 minutes ago)');
  console.log('• Consistent with footer formatting');
  console.log('• Better user understanding of data freshness');
};

// Call this to see the examples
export const showBannerExamples = () => {
  bannerExamples();
};
