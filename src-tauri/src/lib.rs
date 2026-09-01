#[cfg_attr(not(feature = "desktop"), allow(dead_code))]
mod privacy;

#[cfg(feature = "desktop")]
mod desktop;

#[cfg(feature = "desktop")]
pub use desktop::run;
