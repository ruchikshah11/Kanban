import * as React from "react";
import styles from "./Kanban.module.scss";
import { IKanbanProps } from "./IKanbanProps";
import { cloneDeep, escape } from "@microsoft/sp-lodash-subset";
import { IKanbanState } from "./IKanbanState";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
//import * as dataSource from './datasource.json';
import { extend } from "@syncfusion/ej2-base";
import ToDoUrl from "../../../Urls/ITodoUrls";
import { sp } from "@pnp/sp/presets/all";
import { ITodoData } from "../../../models/ITodoData";
import { nullRender } from "office-ui-fabric-react";
require("@syncfusion/ej2-base/styles/material.css");
require("@syncfusion/ej2-buttons/styles/material.css");
require("@syncfusion/ej2-dropdowns/styles/material.css");
require("@syncfusion/ej2-inputs/styles/material.css");
require("@syncfusion/ej2-navigations/styles/material.css");
require("@syncfusion/ej2-popups/styles/material.css");
require("@syncfusion/ej2-react-kanban/styles/material.css");
import { SPHttpClient } from "@microsoft/sp-http";
export default class Kanban extends React.Component<
  IKanbanProps,
  IKanbanState
> {
  constructor(props: IKanbanProps) {
    super(props);
    this.state = {
      lists: [],
    };
    this.data = extend(this.state.lists, null, true) as Object[];
  }
  private data;
  //= extend([], ().kanbanData, null, true) as Object[];
  private listId;

  // onTaskDragStop = async (args) => {
  //   // console.log("args:", args["lists"][0].Title);
  //   //    await this.props.IToDo.updateTask(ToDoUrl.ToDoUrl, args["lists"][0].Title);
  //   await sp.web.lists
  //     .getById(this.listId)
  //     .items.getById(+args.lists[0].Id)
  //     .update({ Status: args["Status"] });
  // };

  onTaskDragStop = async (event) => {
    const data = JSON.stringify({
      Id: event.data[0].Id,
      Status: event.data[0].Status,
    });
    await this.props.wpContext.spHttpClient.post(
      `${this.props.wpContext.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('ToDO')/items(${event.data[0].Id})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
        body: data,
      }
    );
  };

  public async componentDidMount() {
    console.log("Component Did Mount");
    //ID
    const listId = await this.props.IToDo.getListIdByRelUrl(ToDoUrl.ToDoUrl);
    this.listId = listId;
    console.log("Async List ID" + this.listId);

    const list = await sp.web.lists
      .getById(this.listId)
      .items.select("Title,Body,Status,ID")
      .get();
    // console.log(list);
    //Data Read

    list.forEach((element) => {
      this.setState((prevState: IKanbanState): IKanbanState => {
        const data = {
          Id: element.ID,
          Title: element.Title,
          Description: element.Body,
          Status: element.Status,
        };
        let newState = cloneDeep(prevState);
        newState.lists.push(cloneDeep(data));
        return newState;
      });
    });
  }

  public render(): React.ReactElement<IKanbanProps> {
    return (
      // Title //Body //Status
      // id=03243714-886a-4d1c-913e-fcc90cd7775f

      <div className={styles.kanban}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className="kanban-control-section">
                <div className="col-lg-12 control-section">
                  <div className="control-wrapper">
                    <KanbanComponent
                      dragStop={this.onTaskDragStop.bind(this)}
                      id="kanban"
                      keyField="Status"
                      dataSource={this.state.lists}
                      cardSettings={{
                        contentField: "Body",
                        headerField: "Title",
                      }}

                      // dataSource={this.state.lists}
                      // cardSettings={{
                      //   contentField: "Title",
                      //   headerField: "Id",
                      // }}
                    >
                      <ColumnsDirective>
                        <ColumnDirective
                          headerText="Not Started"
                          keyField="Not Started"
                        />
                        <ColumnDirective
                          headerText="In Progress"
                          keyField="In Progress"
                        />
                        <ColumnDirective
                          headerText="Completed"
                          keyField="Completed"
                        />
                        <ColumnDirective
                          headerText="Deferred"
                          keyField="Deferred"
                        />
                        <ColumnDirective
                          headerText="Waiting on someone else"
                          keyField="Waiting on someone else"
                        />
                      </ColumnsDirective>
                    </KanbanComponent>
                    {console.log(this.state.lists)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
