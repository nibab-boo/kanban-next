const size = {
  mobileM: '375px',
  mobileHeight: '800px',
  // mobileL: '428px',
  tabletH: '768px',
  tabletW: '1024px',
  // tabletPro: '1366px',
  // narrow: '1200px',
  laptop: '1440px',
  // standard: '1600px',
  // wide: '1840px',
  // short: '900px'
}

export const breakpoints = {
  iPhone8: `(max-width: ${size.mobileM}) and (max-height: ${size.mobileHeight})`,
  // iPhone: `(max-width: ${size.mobileL})`,
  // notPhone: `(min-width: ${size.mobileL})`,
  iPadH: `(max-width: ${size.tabletH})`,
  iPadW: `(max-width: ${size.tabletW})`,
  // iPadProH: `only screen and (max-device-width: ${size.tabletW}) and (max-device-height: ${size.tabletPro}) and (orientation: portrait)`,
  // iPadProW: `only screen and (max-device-width: ${size.tabletPro}) and (max-device-height: ${size.tabletW}) and (orientation: landscape)`,
  // short: `(max-height: ${size.short}) and (min-width: ${size.tabletW})`,
  // narrow: `(max-width: ${size.narrow})`,
  laptop: `(max-width: ${size.laptop})`,
  // wide: `(max-width: ${size.wide})`,
  // wider: `(/min-width: ${size.wide})`,
};