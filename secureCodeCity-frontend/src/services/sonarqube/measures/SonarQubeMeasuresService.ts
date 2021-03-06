import {CityBuilderStore} from "../../../stores/CityBuilderStore";
import LoadAction from "../../../classes/status/LoadAction";
import ErrorAction from "../../../classes/status/ErrorAction";
import {SceneStore} from "../../../stores/SceneStore";
import VisualizationOptions from "../../../classes/VisualizationOptions";
import {AppStatusStore} from "../../../stores/AppStatusStore";
import {TreeElement} from "../../../classes/TreeElement";
import SonarQubeMeasuresTreeService from "./SonarQubeMeasuresTreeService";
import SonarQubeMeasuresMetricService from "./SonarQubeMeasuresMetricService";

export default class SonarQubeMeasuresService {
    public static LOAD_MEASURES: LoadAction = new LoadAction("SONAR_LOAD_MEASURES", "Request measures from SonarQube");
    private static LOAD_MEASURES_ERROR_KEY: string = "LOAD_MEASURES_ERROR";

    private projectKey: string;
    private appStatusStore: AppStatusStore;
    private cityBuilderStore: CityBuilderStore;
    private sceneStore: SceneStore;

    private measureTreeService: SonarQubeMeasuresTreeService;
    private measureMetricService: SonarQubeMeasuresMetricService;

    private metricKeys: string;

    constructor(projectKey: string, measureTreeService: SonarQubeMeasuresTreeService,
                measureMetricService: SonarQubeMeasuresMetricService, appStatusStore: AppStatusStore,
                cityBuilderStore: CityBuilderStore, sceneStore: SceneStore) {
        this.projectKey = projectKey;
        this.measureTreeService = measureTreeService;
        this.measureMetricService = measureMetricService;
        this.appStatusStore = appStatusStore;
        this.cityBuilderStore = cityBuilderStore;
        this.sceneStore = sceneStore;
    }

    public loadMeasures(options: VisualizationOptions, isForce: boolean = false) {
        this.appStatusStore.load(SonarQubeMeasuresService.LOAD_MEASURES);

        this.sceneStore.options = options;
        this.sceneStore.shapes = null;

        let metricKeys = this.measureMetricService.getMetricRequestValues();

        if (!isForce && this.metricKeys && this.metricKeys === metricKeys) {
            this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
            this.sceneStore.projectData = Object.assign({}, this.sceneStore.projectData);
        } else {

            /**
             * Create a "starting point" root element and load the tree of the project.
             */
            let root: TreeElement =
                new TreeElement(this.projectKey, this.projectKey, {}, this.projectKey, this.projectKey, false);

            this.appStatusStore.loadStatusUpdate(SonarQubeMeasuresService.LOAD_MEASURES.key, 1, 0);

            this.measureTreeService.loadTree(root, metricKeys).then(() => {
                this.measureTreeService.optimizeDirectoryStructure(root);

                this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);

                this.metricKeys = metricKeys;
                this.sceneStore.scmMetricLoaded = false;
                this.sceneStore.projectData = root;

                this.cityBuilderStore.show = false;
            }).catch(() => {
                this.appStatusStore.error(
                    new ErrorAction(SonarQubeMeasuresService.LOAD_MEASURES_ERROR_KEY,
                        "SonarQube metric API is not available or responding: ",
                        "Try again", () => {
                            location.reload();
                        }));
                this.appStatusStore.loadComplete(SonarQubeMeasuresService.LOAD_MEASURES);
            });
        }
    }

}