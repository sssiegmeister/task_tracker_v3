defmodule TaskTrackerV3Web.Plugs.RequireAuth do
  import Plug.Conn

  alias TaskTrackerV3Web.Endpoint
  alias TaskTrackerV3.Users

  def init(args), do: args

  def call(conn, _args) do
    token = get_req_header(conn, "x-auth")
    case Phoenix.Token.verify(Endpoint, "user_id", token, max_age: 86400) do
      {:ok, user_id} ->
        assign(conn, :current_user, Users.get_user!(user_id))
      {:error, err} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => err}))
        |> halt()
    end
  end
end
