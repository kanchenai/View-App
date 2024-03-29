var posterData = {
    poster: require("../images/poster.png")
}

var data = [
    {
        type:"img",
        props:{
            src:require("../images/bg.jpg")
        },
        style:{
            width:"1280px",
            height:"720px"
        }
    },
    {
        type:"group",
        style:{
            width:"1280px",
            height:"120px"
        },
        children:[
            {
                type:"button",
                props:{
                    value:"收藏",
                },
                style:{
                    left:"45px",
                    top:"30px"
                },
                children:[
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/120x60.png")
                        },
                        style:{
                            width:"158px",
                            height:"98px"
                        }
                    }
                ]
            },
            {
                type:"button",
                props:{
                    value:"搜索"
                },
                style:{
                    left:"970px",
                    top:"30px"
                },
                children:[
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/120x60.png")
                        },
                        style:{
                            width:"158px",
                            height:"98px"
                        }
                    }
                ]
            },
            {
                type:"button",
                props:{
                    value:"订购"
                },
                style:{
                    left:"1115px",
                    top:"30px"
                },
                children:[
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/120x60.png")
                        },
                        style:{
                            width:"158px",
                            height:"98px"
                        }
                    }
                ]
            }
        ]
    },
    {
        style:{
            width: "1280px",
            height: "1px",
            top:"120px",
            background:"gray"
        }
    },
    {
        type:"group",
        style:{
            width: "1280px",
            height: "570px",
            top:"120px"
        },
        children: [
            {
                type:"poster",
                props:{
                    size:"560,232"
                },
                style:{
                    left: "72px",
                    top:"19px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/560x232.png")
                        },
                        style:{
                            width:"598px",
                            height:"280px"
                        }
                    }
                ]
            },
            {
                type:"poster",
                props:{
                    size:"176,232"
                },
                style:{
                    left: "647px",
                    top:"19px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/176x232.png")
                        },
                        style:{
                            width:"214px",
                            height:"280px"
                        }
                    }
                ]
            },
            {
                type:"poster",
                props:{
                    size:"176,232"
                },
                style:{
                    left: "838px",
                    top:"19px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/176x232.png")
                        },
                        style:{
                            width:"214px",
                            height:"280px"
                        }
                    }
                ]
            },
            {
                type:"poster",
                props:{
                    size:"176,232"
                },
                style:{
                    left: "1029px",
                    top:"19px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/176x232.png")
                        },
                        style:{
                            width:"214px",
                            height:"280px"
                        }
                    }
                ]
            },
            {
                type:"poster",
                props:{
                    size:"176,232"
                },
                style:{
                    left: "72px",
                    top:"277px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/176x232.png")
                        },
                        style:{
                            width:"214px",
                            height:"280px"
                        }
                    }
                ]
            },
            {
                type:"poster",
                props:{
                    size:"176,232"
                },
                style:{
                    left: "264px",
                    top:"277px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/176x232.png")
                        },
                        style:{
                            width:"214px",
                            height:"280px"
                        }
                    }
                ]
            },
            {
                type:"poster",
                props:{
                    size:"176,232"
                },
                style:{
                    left: "456px",
                    top:"277px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/176x232.png")
                        },
                        style:{
                            width:"214px",
                            height:"280px"
                        }
                    }
                ]
            },
            {
                type:"poster",
                props:{
                    size:"560,232"
                },
                style:{
                    left: "647px",
                    top:"277px"
                },
                data:posterData,
                children: [
                    {
                        id:"focus",
                        type:"img",
                        props:{
                            src:require("../images/focus/560x232.png")
                        },
                        style:{
                            width:"598px",
                            height:"280px"
                        }
                    }
                ]
            },
        ]
    }
];

export default data;
