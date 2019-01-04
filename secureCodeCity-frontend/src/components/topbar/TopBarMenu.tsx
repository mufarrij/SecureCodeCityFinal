import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import VisualizationLinkService from "../../services/VisualizationLinkService";
import TopBarShareButton from "./TopBarShareButton";

interface TopBarMenuProbs {
    cityBuilderStore: CityBuilderStore;
    visualizationLinkService: VisualizationLinkService;
}

@observer
export default class TopBarMenu extends React.Component<TopBarMenuProbs, any> {

    public render() {
        return (
            <div className="top-bar-menu">
                <button
                    id="help-button"
                    className="middle"
                    onClick={this.openPlainVisualizationLink.bind(this)}
                >
                    Open in new plain tab
                </button>
                <button
                    id="settings-button"
                    className="left"
                    onClick={this.showBuilder.bind(this)}
                    disabled={this.props.cityBuilderStore.show}
                >
                    Settings
                </button>
                <TopBarShareButton
                    disabled={this.props.cityBuilderStore.show}
                    visualizationLinkService={this.props.visualizationLinkService}
                />

            </div>
        );
    }

    private showBuilder() {
        this.props.cityBuilderStore.show = true;
    }

    private openPlainVisualizationLink() {
        let result: string = this.props.visualizationLinkService.createPlainVisualizationLink();
        window.open(result);
    }

    /*
    private openHelp() {
        //window.open("LinkToHelpPage");
    }

    private openFeedback() {
        //window.open("LinkToFeedbackPage");
    }
    */
}
