const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Parse JSON bodies for POST and PUT requests
app.use(bodyParser.json());

// Sample data - replace with your own database or data source
let todos = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
];

app.post('/mywebhook', (req, res) => {
    console.log("reached POST endpoint")
    console.log(req.body)
    const reqJsonObj = req.body;
    // newTodo.id = todos.length + 1;
    // todos.push(newTodo);

    let resJsonObj = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": "GCP Monitoring alert",
        "sections": [{
            "activityTitle": "GCP Monitoring alert",
            "activitySubtitle": "On Project Tango",
            "activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
            "facts": [{
                "name": "Policy Name",
                "value": ""
            }, {
                "name": "Metric Name",
                "value": ""
            }, {
                "name": "Condition name",
                "value": ""
            }],
            "markdown": true
        }]
    }

    console.log("resJsonObj: ", resJsonObj)

    resJsonObj.sections[0].activitySubtitle = "On Project " + reqJsonObj.incident.scoping_project_id;
    resJsonObj.sections[0].facts[0].value = reqJsonObj.incident.policy_name;
    resJsonObj.sections[0].facts[1].value = reqJsonObj.incident.metric.displayName;
    resJsonObj.sections[0].facts[2].value = reqJsonObj.incident.condition_name;

    const webhookURL = "https://avaya365.webhook.office.com/webhookb2/036829e4-82f8-4a03-ac7b-737dc2cd44df@04a2636c-326d-48ff-93f8-709875bd3aa9/IncomingWebhook/84b56a0f89b844b5bdc4cef5b48d8e62/6165e0c6-6b67-47d1-847b-d54a2329b5c1";

    axios.post(webhookURL, resJsonObj)
    .then(response => {
      // Handle the response from the POST request
      console.log(response.data);
      res.send('POST request successful');
    })
    .catch(error => {
      // Handle the error if the POST request fails
      console.error(error);
      res.status(500).send('POST request failed');
    });


    // res.status(201).json(resJsonObj);
  });

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Get a specific todo
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Create a new todo
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  newTodo.id = todos.length + 1;
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update an existing todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTodo = req.body;
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    todos[index] = { ...todos[index], ...updatedTodo };
    res.json(todos[index]);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    const deletedTodo = todos[index];
    todos.splice(index, 1);
    res.json(deletedTodo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
