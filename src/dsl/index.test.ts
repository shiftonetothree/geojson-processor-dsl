import { BiQuery, Transform, MultiPointData, MultiPolygonData, Merge, FilterByProperty } from ".";

test("place holder", () => {
    expect(true).toBe(true);
});
test("transform", () => {
    expect({})
});

/** 将低等级行政区划显示为点 */
const toPoint: BiQuery = {
    processes:[
        {
            inputs:[{
                id: "start",
                type: "multiPolygon",
                stage: "origin",
                origin: "农业部，信息处第一张表",
            } as MultiPolygonData],
            pip: {
                type: "transform",
                toShape: "point",
                toShapeMethod: "governmentCentre",
            } as Transform,
            output:{
                id: "result",
                type: "multiPoint",
                stage: "final",
            } as MultiPointData,
        }
    ],
}

/** 将低等级行政区划显示成柱状图 */
const toSquare: BiQuery = {
    processes:[
        {
            inputs:[{
                id: "start",
                type: "multiPolygon",
                stage: "origin",
                origin: "农业部，信息处第一张表",
            } as MultiPolygonData],
            pip: {
                type: "transform",
                toShape: "point",
                toShapeMethod: "governmentCentre",
            } as Transform,
            output:{
                id: "middle",
                type: "multiPoint",
                stage: "middle",
            } as MultiPointData,
        },
        {
            inputs:[{
                id: "middle",
                type: "multiPoint",
                stage: "middle",
            } as MultiPointData],
            pip: {
                type: "transform",
                toShape: "square",
                toShapeDiameter: 2,
                toShapeScale: 1,
                toShapeRotate: 0,
            } as Transform,
            output:{
                id: "result",
                type: "multiPolygon",
                stage: "final",
            } as MultiPolygonData,
        }
    ],
}

/** 按高等级行政区划统计数据 */
const toProvinceCount: BiQuery = {
    processes:[
        {
            pip: {
                type: "transform",
                toShape: "point",
                toShapeMethod: "governmentCentre",
            } as Transform,
            inputs:[{
                id: "start",
                type: "multiPolygon",
                stage: "origin",
                origin: "农业部，信息处第一张表",
            } as MultiPolygonData],
            output:{
                id: "middle",
                type: "multiPoint",
                stage: "middle",
            } as MultiPointData,
        },
        {
            pip: {
                type: "merge",
                conditions: ["contains"],
                merge: {
                    "大型动物总数量": "sum",
                    "小型动物总数量": "sum",
                    "小型动物平均数量": "average",
                },
            } as Merge,
            inputs:[
                {
                    id: "province",
                    type: "multiPolygon",
                    stage: "origin",
                    origin: "省级行政区划",
                } as MultiPolygonData,
                {
                    id: "middle",
                    type: "multiPoint",
                    stage: "middle",
                } as MultiPointData
            ],
            output:{
                id: "middle2",
                type: "multiPolygon",
                stage: "middle",
            } as MultiPolygonData,
        },
        {
            pip: {
                type: "filterByProperty",
                filterByProperty: ["大型动物总数量", ">", 100],
            } as FilterByProperty,
            inputs:[
                {
                    id: "middle2",
                    type: "multiPoint",
                    stage: "middle",
                } as MultiPointData
            ],
            output:{
                id: "result",
                type: "multiPolygon",
                stage: "final",
            } as MultiPolygonData,
        }
    ],
}