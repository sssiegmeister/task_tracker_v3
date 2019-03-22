defmodule TaskTrackerV3Web.SessionController do
  use TaskTrackerV3Web, :controller

  alias TaskTrackerV3.Users.User
  alias TaskTrackerV3.Users
  alias TaskTrackerV3.Endpoint

  def create(conn, %{"name" => name, "password" => password}) do
    with %User{} = user <-Users.get_and_auth_user(name, password) do
      resp = %{
        data: %{
          token: Phoenix.Token.sign(Endpoint, "user_id", user.id),
          user_id: user.id
        }
      }
      conn
      |> put_resp_header("content-type", "application/json; charset=utf-8")
      |> send_resp(:created, Jason.encode!(resp))
    end
  end
end
