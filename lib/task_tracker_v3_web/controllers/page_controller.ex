defmodule TaskTrackerV3Web.PageController do
  use TaskTrackerV3Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
