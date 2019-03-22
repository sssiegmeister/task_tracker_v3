defmodule TaskTrackerV3Web.PageController do
  use TaskTrackerV3Web, :controller

  def index(conn, _params) do
    tasks = TaskTrackerV3.Tasks.list_tasks()
    |> Enum.map(&(Map.take(&1, [:id, :title, :description, :minutes_worked_on, :completed])))
    render conn, "index.html", tasks: tasks
  end
end
