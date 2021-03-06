import { formatMoney } from './formatMoney.js';
import React from "react";
import matchSorter from 'match-sorter';


//////////////////Mobile Orientation Change//////////////////////////

////This is a bit of a hack. There is probably a better solution but I will figure it out later.

export function updateWindowDimensions() {
    switch(window.orientation) {  
      case -90 || 90:
        this.setState(() => {
          return {windowWidth: window.innerHeight}
        });
        break; 
      default:
        this.setState(() => {
          return {windowWidth: window.innerWidth}
        });
        break; 
    }
  }

  
///////////////manipulate filtered data functions///////////////

export function unformatMoney(dollars) {
    return Number(dollars.replace(/[^0-9\\.-]+/g,""));
}

export function averageEntries(data) {
    let sum = data.reduce((prev, cur) => {
    return prev + unformatMoney(cur.amount)
    }, 0);
    return formatMoney(sum/data.length)
}

export function sumEntries(data) {
    let sum = data.reduce((prev, cur) => {
    return prev + this.unformatMoney(cur.amount)
    }, 0);
    return formatMoney(sum)
}

export function mobileColumns() {
    return [
        {
          Header: "Category",
          accessor: "category_name",
          maxWidth: 200,
          filterMethod: (filter, row) => {
            if (filter.value === "income") {
              return row._original.income === true && row._original.untracked === false;
            }
            if (filter.value === "expense") {
              return row._original.income === false && row._original.untracked === false;
            }
            return row[filter.id] === filter.value;
          },
          Filter: ({filter, onChange}) =>
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: "100%" }}
              value={filter ? filter.value : ""}
              >
              <option value="">All</option>
              <option value="income">Only Income</option>
              <option value="expense">Only Expenses</option>
              {this.props.current_user.categories.map( category =>
                <option
                  key={category.id}
                  value={category.name}>{category.name}</option>
                )
              }
            </select>
        },
        {
          Header: "Date",
          accessor: "date",
          Footer: (<span><strong>Sum:</strong></span>),
          maxWidth: 110,
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["date"] }),
            filterAll: true
        },
        {
          Header: "Amount",
          id: "amount",
          accessor: d => {
            return "$" + Number(d.amount).toFixed(2)
          },
          Footer: columnProps => {
            return(
              <span>
                {columnProps.data.length > 0 ? this.sumEntries(columnProps.data) : 0}
              </span>
            )
          },
          maxWidth: 100,
          sortMethod: (a, b) => {
            if (a === b) {
              return 0;
            }
            const aInteger = Number(a.replace(/[^0-9\\.-]+/g,""));
            const bInteger = Number(b.replace(/[^0-9\\.-]+/g,""));
            // Originally this ^ was .replace(/[^0-9\.-]+/g,"") but the linter was throwing a "unnecessary escape character" error so I escaped it. Not sure if this is cool or not.
            return aInteger > bInteger ? 1 : -1;
          },
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["amount"] }),
            filterAll: true
        }
      ]
}

export function desktopColumns() {
    return [
        ...this.mobileColumns(),
        {
          Header: "Notes",
          accessor: "notes",
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["notes"] }),
            filterAll: true
        }
      ]
}