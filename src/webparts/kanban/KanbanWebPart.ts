import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'KanbanWebPartStrings';
import Kanban from './components/Kanban';
import { IKanbanProps } from './components/IKanbanProps';
import { sp } from "@pnp/sp";
import IToDo from '../../Services/IToDo';
import "@syncfusion/ej2-base/styles/material.css";
import '@syncfusion/ej2-buttons/styles/material.css';
import "@syncfusion/ej2-layouts/styles/material.css";
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-kanban/styles/material.css";
export interface IKanbanWebPartProps {
  description: string;
  WpContext:WebPartContext
}

export default class KanbanWebPart extends BaseClientSideWebPart<IKanbanWebPartProps> {
  private IToDo: IToDo;

  onInit = (): Promise<void> => {
    return new Promise<void>(
      (resolve) => {
        this.IToDo = new IToDo(this.context);
        sp.setup(
          {
            spfxContext: this.context
          }
        );

        resolve();
      }
    );
  }
  public render(): void {
    const element: React.ReactElement<IKanbanProps> = React.createElement(
      Kanban,
      {
        description: this.properties.description,
        wpContext:this.context,
        IToDo:this.IToDo
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
