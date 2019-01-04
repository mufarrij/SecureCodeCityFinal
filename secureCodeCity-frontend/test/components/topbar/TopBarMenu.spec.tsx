import * as React from "react";
import { expect} from "chai";
import {shallow} from "enzyme";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import * as Sinon from "sinon";

describe("<TopBarMenu/>", () => {

    it("should show settings button and check action", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}
                        visualizationLinkService={localVisualizationLinkService}/>
        );

        const settingsButton = topBarMenu.find("#settings-button");

        settingsButton.simulate("click");
        expect(localCityBuilderStore.show).to.be.true;
    });
    it("should have share component", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        localCityBuilderStore.show = true;

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}
                        visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(topBarMenu.contains(
            <TopBarShareButton disabled={true} visualizationLinkService={localVisualizationLinkService}/>)
        ).to.be.true;
    });
});