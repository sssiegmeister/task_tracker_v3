# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :task_tracker_v3,
  ecto_repos: [TaskTrackerV3.Repo]

# Configures the endpoint
config :task_tracker_v3, TaskTrackerV3Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "WBfYwA7fRA8dqfhBIl26sselStFdYPtRIe78vZRtyDD9Zwkju3IsJbZeX8z4WJwo",
  render_errors: [view: TaskTrackerV3Web.ErrorView, accepts: ~w(html json)],
  pubsub: [name: TaskTrackerV3.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
