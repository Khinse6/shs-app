use tauri::Builder;
mod hello;

pub fn register_commands<R: tauri::Runtime>(builder: Builder<R>) -> Builder<R> {
    builder.invoke_handler(tauri::generate_handler![hello::greet])
}
