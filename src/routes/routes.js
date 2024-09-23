import { buildRoutePath } from "../utils/build-route-path.js";
import { randomUUID } from "node:crypto";
import { getDateLocal } from "../utils/get-date-local.js";
import { Database } from "../../database.js";
import { handleErros } from "../utils/handle-errors.js";
import { createTaskValidator } from "../utils/create-task-validator.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Título e Descrição são campos obrigatórios!",
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: getDateLocal(),
        updated_at: null,
        completed_at: null,
      };

      database.insert("tasks", task);
      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.query;
      const tasks = database.select(
        "tasks",
        title || description ? { ...req.query } : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.selectOne("tasks", id);
      if (!task) {
        return handleErros(res, { code: 404, message: "Task not found" });
      }
      return res.end(JSON.stringify(task));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Título e Descrição são campos obrigatórios!",
          })
        );
      }
      const task = database.update(
        "tasks",
        id,
        title || description ? { ...req.body } : null
      );
      if (!task) {
        return handleErros(res, { code: 404, message: "Task not found" });
      }
      return res.end(JSON.stringify(task));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.selectOne("tasks", id);
      if (!task) {
        return handleErros(res, { code: 404, message: "Task not found" });
      }
      database.complete("tasks", id);
      return res.writeHead(204).end();
    },
  },
];
