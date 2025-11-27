use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {

            println!("a new app instance was opened with {argv:?} and the deep link event was already triggered");

            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }
    builder = builder.plugin(tauri_plugin_opener::init());
    builder = builder.plugin(tauri_plugin_deep_link::init());

    builder = builder.setup(|app| {
        // Note that get_current's return value will also get updated every time on_open_url gets triggered.
        let start_urls = app.deep_link().get_current()?;
        if let Some(urls) = start_urls {
            // app was likely started by a deep link
            println!("Started with deep link URLs: {:?}", urls);
        }

        app.deep_link().on_open_url(|event| {
            println!("Normal deep link URLs: {:?}", event.urls());
        });
        Ok(())
    });

    builder = builder.setup(|app| {
        #[cfg(any(windows, target_os = "linux"))]
        {
            use tauri_plugin_deep_link::DeepLinkExt;
            app.deep_link().register_all()?;
        }
        Ok(())
    });

    let builder = commands::register_commands(builder);

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
