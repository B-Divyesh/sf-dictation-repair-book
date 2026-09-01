#[cfg(feature = "desktop")]
fn main() {
    dictation_repair_book_lib::run();
}

#[cfg(not(feature = "desktop"))]
fn main() {}
