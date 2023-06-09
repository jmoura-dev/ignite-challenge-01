import { Database } from "../database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if(!title || !description) {
        throw new Error("Preencha todos os campos para criar uma task")
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        updated_at: null,
        created_at: new Date(),
        completed_at: null
      }
  
      database.insert("tasks", task);
  
      return res.writeHead(201).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id);

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if(!title || !description) {
        throw new Error("Preencha todos os campos para realizar atualização.")
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const { complete } = req.body;

      database.oneUpdate('tasks', id, complete);

      return res.writeHead(204).end();
    }
  }
]