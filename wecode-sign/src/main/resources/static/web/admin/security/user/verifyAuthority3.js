// TODO: 1.pageContext 需要预加载 ，2.widget/data/datable 需要在使用时加载
pageContext.controller("admin.security.user.verifyAuthority3",[],function(page){
	var _record;
	page.ready = function(){


	};
	
	page.init = function(record){ 
		$("#formAuthority").jsonData(_record = record);

		var gridOption = {
			selectMode:'multi', /* 多选：multi,单选：single,默认：normal */
			height:300,
			editable:true,
			/*pageOp:{
				// el:"#pageDemo",
				pageSize:10,
				curPage:1,
				pageSizeRange:[10,20,50,100,200,500]
			},*/
			columns:[
				{
					field:"id",
					header:"ID",
					width:120,
					editable:false
				},{
					field:"roleId",
					header:"角色",
					renderer:function(v,record){
						return record.roleName || v;
					},
					editor:{
						type:"combobox",
						dataset:"/services/security/role/s",
						valueField:"id",
						textField:"name"
					},
					width:220
				},{
					field:"dataRangeId",
					header:"数据范围",
					width:220,
					editable:false
				},{
					field:"status",
					header:"状态",
					renderer:function(val){
						return val ? "状态  "+val : "";
					}
				}
			]
			,dataset: "/services/security/user/{0}/permissions".format(record.id)// [] or getUrl or {} ajaxOption
			,operation:{
				search:{
					btn:"#btnSearch",
					panel:"#formSearch"
				},
				add:{
					btn:"#btnAddAuthority",
					data:{
						dataRange:"No Control",
						roleId:"1"
					}
				},
				del:{
					btn:"#btnDelAuthority"
				},
				save:{
					btn:"#btnSaveAuthority",
					ajax:{
						url:"/services/security/user/{0}/permissions/batch".format(record.id) // 默认PUT
						,success:function () {
							$("#gridVerifyAuthority").xWidget().reload();
						}
					}
				}
				// TODO:这里可以添加更多选项，例如批量删除，等选中后批量操作的内容，比如批量更新某个属性（状态）
				// batch {  del : { btn:"#btnBatchDelete" }, enable:{ btn:"#btnEnableStatus" , ajax:{ url:xxx ,data:data, method:"post"}}
			}
		};

		// 绑定表格
		$("#gridVerifyAuthority").xWidget("datatable",gridOption);
	}
	
});