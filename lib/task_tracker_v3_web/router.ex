defmodule TaskTrackerV3Web.Router do
  use TaskTrackerV3Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", TaskTrackerV3Web do
    pipe_through :browser

    get "/", PageController, :index
  end

  scope "/api/v1", TaskTrackerV3Web do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit]
    resources "/tasks", TaskController, except: [:new, :edit]

    post "/edittask", TaskController, :update
    post "/createtask", TaskController, :create
    post "/edituser", UserController, :update
    post "/auth", UserController, :authenticate
    post "/register", UserController, :create
  end
end
