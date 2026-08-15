# Rails app template — scaffolder entry point. Thin dispatcher: inputs, source_paths,
# the layers, and the finalize step. All the actual work lives in lib/templates/*.rb.
#
# Usage (direct):
#   rails new MyApp -d postgresql -m /path/to/this/template.rb -T --skip-jbuilder
#
# Preferred entry point — bin/scaffold, which sets ENV and runs `rails new`.
#
# Presets:
#   tma  (default) — base + Telegram Mini App overlay
#   base           — Rails + Docker + admin + auth, без Telegram
#
# Inputs (read from ENV, populated by bin/scaffold):
#   PRESET        — tma | base
#   APP_NAME      — display name (defaults to app_name.titleize)
#   ADMIN_LOGIN   — initial superuser login (defaults to "admin")
#   ADMIN_PASS    — initial superuser password (defaults to "admin123")
#   TG_BOT_TOKEN  — Telegram bot token, preset=tma only (kept in .env, NOT committed)

require 'fileutils'

def template_root
  @template_root ||= File.expand_path(File.dirname(__FILE__))
end

# ONE definition for the whole run — the layers must not redefine it. `apply` is a
# plain instance_eval on this generator, so a second `def source_paths` in a layer
# would replace this one retroactively, including for the after_bundle blocks that
# run long after both layers were applied.
#
# `+ super` keeps railties' own template dir reachable: tasks that run AFTER the
# template (run_kamal, run_solid, run_javascript, run_css) resolve their templates
# through this very method, and without it they raise "Could not find X in any of
# your source paths".
def source_paths
  [File.join(template_root, 'lib/templates'), template_root] + super
end

# ---- Inputs ----------------------------------------------------------------
@preset = ENV['PRESET'].to_s.empty? ? 'tma' : ENV['PRESET'].to_s
raise ArgumentError, "Unknown PRESET #{@preset.inspect} — expected 'tma' or 'base'" \
  unless %w[tma base].include?(@preset)

@app_display_name = ENV['APP_NAME'] || app_name.titleize
@admin_login      = ENV['ADMIN_LOGIN'] || 'admin'
@admin_pass       = ENV['ADMIN_PASS']  || 'admin123'
@bot_token        = ENV['TG_BOT_TOKEN'].to_s
@next_steps       = []

say_status :scaffold, "#{app_name} — preset #{@preset} (display: #{@app_display_name})"

# ---- Layers ----------------------------------------------------------------
# Absolute paths: a relative `apply` is looked up in source_paths, not next to this
# file (thor/lib/thor/actions.rb:219).
apply File.expand_path('lib/templates/base.rb', template_root)
apply File.expand_path('lib/templates/tma.rb', template_root) if @preset == 'tma'

# ---- Finalize --------------------------------------------------------------
# Registered last, so it runs after every layer's after_bundle block.
after_bundle do
  # Initial commit (BEFORE activating the pre-commit hook — it blocks main/master).
  git :init unless File.exist?('.git/HEAD')
  git add: '.'
  git commit: %Q[-m "scaffold via rails_template (#{@preset}) — #{Time.now.utc.iso8601}"]

  # Activate githooks — from this point on, commits to main/master are blocked.
  run "git config core.hooksPath .githooks"

  say_status :scaffold, '✅ Done. Next steps:'
  say "
  cd #{app_name}
  ./run setup && ./run up     # либо bin/dev без докера

#{@next_steps.join("\n")}
  "
end
