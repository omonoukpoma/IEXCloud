import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class IEXCloudSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: "",
      results: [],
      pageNumber: 1,
      token: "" /* PLACE TOKEN VALUE HERE */
    };

    this.getResults = this.getResults.bind(this);
    this.updateSymbol = this.updateSymbol.bind(this);
    this.updatePagePosition = this.updatePagePosition.bind(this);
    this.constructPagination = this.constructPagination.bind(this);
  }

  updateSymbol(e) {
    this.setState({
      symbol: e.target.value
    });
  }

  getResults() {
    axios
      .get(
        `https://cloud.iexapis.com/beta/stock/${
          this.state.symbol
        }/balance-sheet/20?token=${this.state.token}`
      )
      .then(res => {
        console.log(res.data);
        this.setState({
          results: res.data.balancesheet
        });
      });
  }

  constructPagination(results) {
    let pages = [];
    let numPages = Math.floor(this.state.results.length / 5);
    if (this.state.results.length % 5 > 0) numPages++;

    if (numPages > 1) pages.push("<");
    for (let i = 0; i < numPages; i++) {
      pages.push(i + 1);
    }
    if (numPages > 1) pages.push(">");

    return pages;
  }

  updatePagePosition(index, numPages) {
    let pos = index;
    if (index === 0) {
      pos = this.state.pageNumber > 1 ? this.state.pageNumber - 1 : 1;
    } else if (index > numPages) {
      pos =
        this.state.pageNumber < numPages ? this.state.pageNumber + 1 : numPages;
    }
    this.setState({ pageNumber: pos });
  }

  render() {
    const maxCount = 5;
    const pages = this.constructPagination();
    const startPosition =
      this.state.pageNumber === 1 ? 0 : (this.state.pageNumber - 1) * maxCount;
    const stopPosition = this.state.pageNumber * maxCount;

    return (
      <div className="container">
        <input
          type="text"
          onChange={e => this.updateSymbol(e)}
          onKeyPress={e => {
            if (e.which === 13) this.getResults();
          }}
          placeholder="Enter stock symbol"
        />
        <button onClick={this.getResults}>GO</button>
        <div className="results">
          {this.state.symbol && (
            <p>
              You searched for: <b>{this.state.symbol}</b>
            </p>
          )}
          <ul className="results-table">
            {this.state.results &&
              this.state.results.map((item, index) => {
                if (index >= startPosition && index < stopPosition) {
                  return (
                    <li key={index}>
                      Report Date: {item.reportDate}
                      <br />
                      Retained Earnings: {item.retainedEarnings}
                      <br />
                    </li>
                  );
                } else {
                  return "";
                }
              })}
          </ul>

          <ul className="pagination">
            {pages &&
              pages.map((pageNumber, index) => {
                return (
                  <li
                    key={index}
                    onClick={() =>
                      this.updatePagePosition(index, pages.length - 2)
                    }
                    className={
                      this.state.pageNumber === pageNumber ? "active" : ""
                    }
                  >
                    {pageNumber}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<IEXCloudSearch />, rootElement);
