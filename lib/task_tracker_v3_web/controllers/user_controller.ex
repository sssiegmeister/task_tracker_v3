defmodule TaskTrackerV3Web.UserController do
  use TaskTrackerV3Web, :controller

  alias TaskTrackerV3.Users
  alias TaskTrackerV3.Users.User
  alias TaskTrackerV3Web.Endpoint

  action_fallback TaskTrackerV3Web.FallbackController

  def authenticate(conn, %{"name" => name, "password" => password}) do
    with {:ok, %User{} = user} <- Users.get_and_auth_user(name, password) do
      IO.puts(inspect(user))
      resp = %{
        data: %{
          token: Phoenix.Token.sign(Endpoint, "user_id", user.id),
          user_id: user.id
        }
      }
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:created, Jason.encode!(resp))
    end
  end

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"name" => name, "password" => password}) do
    with {:ok, %User{} = user} <- Users.create_user(name, password) do
      resp = %{
        data: %{
          token: Phoenix.Token.sign(Endpoint, "user_id", user.id),
          user_id: user.id
        }
      }
      conn
      |> put_resp_header("location", user_path(conn, :show, user))
      |> send_resp(:created, Jason.encode!(resp))
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    u = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(u, user_params) do
      resp = %{
        data: %{
          token: Phoenix.Token.sign(Endpoint, "user_id", user.id),
          user_id: user.id
        }
      }
      conn
      |> put_resp_header("location", user_path(conn, :show, user))
      |> send_resp(:created, Jason.encode!(resp))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
