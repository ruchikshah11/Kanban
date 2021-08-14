import { WebPartContext } from "@microsoft/sp-webpart-base";
import IToDo from "../../../Services/IToDo";

export interface IKanbanProps {
  description: string;
  wpContext:WebPartContext;
  IToDo:IToDo;
}
