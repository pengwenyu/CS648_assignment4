/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint "react/jsx-no-undef": "off" */

/* eslint "react/no-multi-comp": "off" */

/* eslint "no-alert": "off" */
// eslint-disable-next-line react/prefer-stateless-function
class IssueFilter extends React.Component {
  render() {
    return React.createElement("div", null, "Showing all avalible products");
  }

}

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
    return null;
  }
}

function $issue(string) {
  const string1 = '$';
  const string2 = string1 + string;
  return string2;
}

function IssueRow({
  issue
}) {
  return React.createElement("tr", null, React.createElement("td", null, issue.id), React.createElement("td", null, issue.name), React.createElement("td", null, $issue(issue.price)), React.createElement("td", null, issue.category), React.createElement("td", null, React.createElement("a", {
    href: issue.image,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "view")));
}

function IssueTable({
  issues
}) {
  const issueRows = issues.map(issue => React.createElement(IssueRow, {
    key: issue.id,
    issue: issue
  }));
  return React.createElement("table", {
    className: "bordered-table",
    border: "2"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product ID"), React.createElement("th", null, "Product Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, issueRows));
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      category: form.category.value,
      price: form.price.value.replace('$', ''),
      name: form.name.value,
      image: form.image.value
    };
    const {
      createIssue
    } = this.props;
    createIssue(issue);
    form.category.value = 'Shirts';
    form.price.value = '$';
    form.name.value = '';
    form.image.value = '';
  }

  render() {
    return React.createElement("form", {
      name: "issueAdd",
      onSubmit: this.handleSubmit
    }, "Category:", React.createElement("br", null), React.createElement("select", {
      name: "category"
    }, React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories")), React.createElement("br", null), "Price Per Unit:", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "price",
      placeholder: "$"
    }), React.createElement("br", null), "Product Name:", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "name",
      placeholder: "Product Name"
    }), React.createElement("br", null), "Image URL:", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "image",
      placeholder: "Image"
    }), React.createElement("br", null), React.createElement("button", {
      type: "submit"
    }, "Add Product"));
  }

}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: []
    };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
    issueList {
    id name category price image
}
}`;
    const data = await graphQLFetch(query);

    if (data) {
      this.setState({
        issues: data.issueList
      });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
  issueAdd(issue: $issue) {
    id,
        }
    }`;
    const data = await graphQLFetch(query, {
      issue
    });

    if (data) {
      this.loadData();
    }

    this.loadData();
  }

  render() {
    const {
      issues
    } = this.state;
    return React.createElement(React.Fragment, null, React.createElement("h1", null, "My company Inventory"), React.createElement(IssueFilter, null), React.createElement("hr", null), React.createElement(IssueTable, {
      issues: issues
    }), React.createElement("hr", null), React.createElement("h2", null, "Add a new product to inventory"), React.createElement(IssueAdd, {
      createIssue: this.createIssue
    }));
  }

}

const element = React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById('contents'));