<template>
  <div class="container">
    <!-- 顶部导航栏 -->
    <GeneralTopBar :showPosition="false"/>
    <main class="margin-20per">
      <aside>
        <ul>
          <li v-for="menu in menuList" :key="menu.name"
              :class="{'selected': currentMenu === menu.name}"
              @click="menuSelect(menu.name)"
          >
            <SymbolIcon :icon-class="menu.icon"/>
            <el-link  :href="menu.href">{{ menu.name }}</el-link>
          </li>
        </ul>
      </aside>
      <div class="main-content">
        <transition name="el-fade-in">
          <div class="apply" v-if="!showResume">
            <div class="filter-select">
<!--              <div class="filter-job-industry">-->
<!--                <ul>-->
<!--                  <li v-for="(industry,index) in filterIndustry"-->
<!--                      :key="industry.job_industry + index"-->
<!--                      :class="{'is-selected': currentIndustry === industry.job_industry}"-->
<!--                      @click="industrySelect(industry.job_industry)">-->
<!--                    <span class="job-industry">{{ industry.job_industry }}</span>-->
<!--                    <span class="job-num">{{ industry.job_num }}</span>-->
<!--                  </li>-->
<!--                </ul>-->
<!--                <el-input-->
<!--                      class="search-input"-->
<!--                      placeholder="搜索求职者、院校、应聘职位"-->
<!--                      prefix-icon="el-icon-search"-->
<!--                      v-model="searchKey"-->
<!--                      @change="search">-->
<!--                </el-input>-->
<!--              </div>-->
              <div class="filter-condition">
<!--                <div class="condition-wrapper">-->
<!--                  <span>投递职位：</span>-->
<!--                  <SelectWrapper :label="currentJob" :options="filterConditionJob.map(item => item.job_duty)" @update:label="changeJob"/>-->
<!--                </div>-->
                <div class="condition-wrapper">
                  <span>简历状态：</span>
                  <SelectWrapper :label="currentStatus" :options="conditionStatus" @update:label="changeDate"/>
                </div>
                <div class="selected-btn">
                  <el-button round @click="updateStatus(selectedApplyIds,'1')">一键面试</el-button>
                  <el-button round @click="updateStatus(selectedApplyIds,'2')">一键拒绝</el-button>
                </div>
              </div>
            </div>
            <div class="apply-table" v-if="applyList.length === 0">
              <el-empty :image-size="200"></el-empty>
            </div>
            <div class="apply-table" v-else>
              <el-table
                    ref="multipleTable"
                    :data="applyList"
                    stripe
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                      type="selection"
                      width="60"
                      align="center">
                </el-table-column>
                <el-table-column
                      label="基本信息"
                      width="400px">
                  <template v-slot:default="scope">
                    <div class="apply-applicant">
                      <img :src="scope.row.applicant_avatar" :alt="scope.row.applicant_name"
                           style="width: 65px; height: 65px;"/>
                      <p>
                        <el-button type="text" class="applicant_name" @click="viewResume(scope.row.applicant_id)">{{ scope.row.applicant_name }}</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <span>{{ scope.row.applicant_sex }}</span>
                        <el-divider direction="vertical"></el-divider>
                        <span>{{ scope.row.applicant_age }}岁</span>
                        <el-divider direction="vertical"></el-divider>
                        <span>{{ scope.row.working_year }}经验</span>
                        <el-divider direction="vertical"></el-divider>
                        <span>{{ scope.row.applicant_education }}</span>
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="applicant_identity">
                  <template v-slot:header="scope">
                    <span class="label">{{ secondLabel }}</span>
                    <el-dropdown placement="bottom-start" @command="handleCommand">
                        <span class="el-dropdown-link">
                          <i class="el-icon-refresh"></i>
                        </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                              v-for="(header,index) in secondHeader"
                              :key="header + index"
                              :command="{column: scope.column, key: header }"
                        >{{ header }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
                <el-table-column
                      prop="school_name"
                      label="院校信息">
                </el-table-column>
                <el-table-column
                      prop="job_duty"
                      label="应聘职位">
                </el-table-column>
                <el-table-column
                      prop="create_date"
                      label="投递时间">
                  <template slot-scope="scope">
                    {{scope.row.create_date[0]}}-
                    {{scope.row.create_date[1]}}-
                    {{scope.row.create_date[2]}}
<!--                    {{scope.row.create_date[3]}}:-->
<!--                    {{scope.row.create_date[4]}}:-->
<!--                    {{scope.row.create_date[5]}}-->
                  </template>
                </el-table-column>
                <el-table-column
                      label="操作"
                      align="center">
                  <template v-slot:default="scope">
                    <div class="handle">
                      <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                          <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                                v-for="(handle,index) in userHandle"
                                :key="handle.label + index"
                                :command="{row: scope.row, key: handle.label }"
                          ><i :class="handle.icon"></i>
                            {{ handle.label }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页栏 -->
              <div class="page margin-20per">
                <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage"
                      :page-size="pageSize"
                      background
                      layout="prev, pager, next"
                      :total="total">
                </el-pagination>
              </div>
            </div>
          </div>
          <ShowResume v-else :applicant_id="selectedApplicantId"/>
        </transition>
      </div>
<!--      简历-->
<!--      <Resume :applicant_id="applicant_id" v-if="applicant_id" />-->

    </main>
    <!-- 底部信息栏 -->
    <GeneralFooter />
  </div>
</template>

<script>
    import GeneralTopBar from "../../../components/GeneralTopBar.vue";
    import GeneralFooter from "../../../components/GeneralFooter.vue";
    import SymbolIcon from "@/components/SymbolIcon.vue";
    import SelectWrapper from "@/components/SelectWrapper.vue";
    import * as Constant from "@/common/constants.js"
    import ShowResume from "@/views/general/widgets/ShowResume";
    // import Resume from "../applicant/widget/Resume.vue";
    export default {
        name: "RecruiterMessage",
        components: {
            GeneralTopBar,
            GeneralFooter,
            SymbolIcon,
            SelectWrapper,
            ShowResume,
            // Resume
        },
        data() {
            return {
              //进入简历页面，传的id
              applicant_id:"",
                menuList: [
                    { icon: "el-icon-gongzuotai", name: "工作台", href: "/recruiter"},
                    { icon: "el-icon-zhiwei", name: "职位管理", href: "/recruiter/job"},
                    { icon: "el-icon-jianli", name: "简历处理", href: "/recruiter/resume"},
                    // { icon: "el-icon-mianshi", name: "面试相关", href: "/recruiter/interview"},
                    // { icon: "el-icon-xiaoxi", name: "我的消息", href: "/recruiter/message"},
                    { icon: "el-icon-shezhi", name: "账号设置", href: "/recruiter/setting"}
                ],
                currentMenu: "简历处理",
                industryList: [],
                /*industryList: [
                    { job_industry: "全部", job_num: 39 },
                    { job_industry: "技术", job_num: 11 },
                    { job_industry: "产品", job_num: 9 },
                    { job_industry: "运营", job_num: 3 },
                    { job_industry: "设计", job_num: 6 },
                    { job_industry: "销售", job_num: 0 },
                    { job_industry: "咨询/翻译/法律", job_num: 0 },
                    { job_industry: "人事/财务/行政", job_num: 0 },
                    { job_industry: "市场", job_num: 10 }
                ],*/
                currentIndustry: "全部",
                searchKey: "",
                /*conditionJob: [
                    { job_duty: "不限", job_industry: "全部"},
                    { job_duty: "前端工程师", job_industry: "技术"},
                    { job_duty: "后端工程师", job_industry: "技术"},
                    { job_duty: "所有来自我发布的职位", job_industry: "职位所属行业"},
                ],*/
                conditionJob: [],
                currentJob: "不限",
                conditionStatus: ["未处理","邀面试","已拒绝","已结束"],
                currentStatus: "未处理",
                //传入后端的状态
                status:0,
                //传入后端的时间参数
                date:"",
                // applyList: [],
                applyList: [
                    {
                      //投递id
                      apply_id:"",
                      // 简历id
                      applicant_id:"",
                        applicant_avatar: require("@/image/avatar/applicant_zhang.png"),
                        applicant_name: "张三",
                        applicant_sex: "男",
                        applicant_age: 22,
                        working_year: "1年",
                        applicant_education: "本科",
                        applicant_identity: "学生",
                        // major: "软件工程",
                        school_name: "清华大学",
                        job_duty: "前端工程师",
                        create_date: "2022-3-15 14:00",
                    },
                    // {
                    //     applicant_avatar: require("@/image/avatar/applicant_huang.png"),
                    //     applicant_name: "黄瑾",
                    //     applicant_sex: "女",
                    //     applicant_age: 21,
                    //     working_year: "暂无",
                    //     applicant_education: "本科",
                    //     applicant_identity: "学生",
                    //     major: "电子信息工程",
                    //     school_name: "北京大学",
                    //     job_duty: "前端助理",
                    //     create_date: "2022-3-18 10:00",
                    // },
                    // {
                    //     applicant_avatar: require("@/image/avatar/applicant_tong.png"),
                    //     applicant_name: "童景程",
                    //     applicant_sex: "男",
                    //     applicant_age: 25,
                    //     working_year: "2年",
                    //     applicant_education: "本科",
                    //     applicant_identity: "职场人士",
                    //     major: "",
                    //     school_name: "",
                    //     job_duty: "前端开发工程师",
                    //     create_date: "2022-3-21 16:30",
                    // },
                    // {
                    //     applicant_avatar: require("@/image/avatar/applicant_wei.png"),
                    //     applicant_name: "魏晴雅",
                    //     applicant_sex: "女",
                    //     applicant_age: 27,
                    //     working_year: "3年",
                    //     applicant_education: "本科",
                    //     applicant_identity: "职场人士",
                    //     major: "电子商务",
                    //     school_name: "南京大学",
                    //     job_duty: "内容运营",
                    //     create_date: "2022-3-24 16:30",
                    // },
                ],

                secondLabel: Constant.HEADER_TABLE_IDENTITY,
                secondHeader: [Constant.HEADER_TABLE_IDENTITY, Constant.HEADER_TABLE_MAJOR],
            
                userHandle: [
                    // { icon: "el-icon-s-opportunity", label: Constant.INTERESTED},
                    { icon: "el-icon-message", label: Constant.INTERVIEW_INVITATION},
                    { icon: "el-icon-delete-solid", label: Constant.INAPPROPRIATE},
                    { icon: "el-icon-s-opportunity", label: Constant.DONE}
                ],
                currentPage: 1,
                pageSize: 10,
                total: 1000,
                
                showResume: false,
                selectedApplicantId: "",
                // 保存选中的投递ID列表
                selectedApplyIds: [],
            }
        },
        computed: {
            filterIndustry() {
                return this.industryList.filter(item => item.job_industry === "全部" || item.job_num)
            },
            filterConditionJob() {
                if (this.currentIndustry !== "全部") {
                    const filterArr = this.conditionJob.filter(item => item.job_industry === this.currentIndustry);
                    filterArr.unshift({
                        job_duty: "不限",
                        job_industry: "全部"
                    });
                    return filterArr;
                }
                return this.conditionJob
            }
        },
        created() {
            this.$store.commit("setLogin");
            this.initData();
        },
        methods: {
            initData() {
                this.$axios.all([this.getIndustryList(),this.getConditionJob(),this.getApplyList()]);
            },
            async getIndustryList() {
                const res = await this.$axios.request({
                    url: `/apply/countByIndustry/${this.$store.state.login_id}`,
                    method: "get"
                })
                console.log(res);
                if(res.msg === "success") {
                    this.industryList = Object.assign(  [],[],res.data.industryList);
                    const allCount = this.industryList.reduce((prev, cur) => prev += cur.job_num,0);
                    let obj = {
                        job_industry: "全部",
                        job_num: allCount
                    }
                    this.industryList.unshift(obj);
                    console.log(this.industryList)
                }
            },
            async getConditionJob() {
                const res = await this.$axios.request({
                    url: `/apply/getJobDuty/${this.$store.state.login_id}`,
                    method: "get"
                })
                console.log(res);
                if(res.msg === "success") {
                    this.conditionJob = Object.assign([],[],res.data.conditionJob);
                    this.conditionJob.unshift({
                        job_duty: "不限",
                        job_industry: "全部"
                    });
                }
            },
            async getApplyList() {
                if("邀面试"==this.currentStatus) this.status =1;
                else if("已拒绝"==this.currentStatus) this.status = 2;
                else if("已结束"==this.currentStatus) this.status = 3;
                else if("未处理"==this.currentStatus) this.status = 0;
              console.log(this.currentStatus)
              console.log(this.status)

              const res = await this.$axios.request({
                    url: `/user-job-applycation/getAllResume`,
                    method: "get",
                    params: {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize,
                        uid: JSON.parse(window.sessionStorage.getItem('user')).id,
                        status: this.status
                        // job_duty: this.currentJob !== "不限" ? this.currentJob : "",
                        // job_industry: this.currentIndustry !== "全部" ? this.currentIndustry : "",
                        // condition: this.currentDate
                    }
                })
                console.log(res);

                    res.data.forEach(item => {
                        if(!item.resume.id){
                          return;
                        }
                      item.apply_id = item.id;
                      item.applicant_id = item.resume.id;

                      if(item.resume_baseinfo.applicant_avatar){
                          item.applicant_avatar = require("@/image/avatar/" + item.resume_baseinfo.applicant_avatar);
                        }
                        item.applicant_name = item.resume_baseinfo.applicant_name;
                        item.applicant_sex = item.resume_baseinfo.applicant_sex;
                        item.applicant_age = item.resume_baseinfo.applicant_age;
                        item.working_year = item.resume_baseinfo.working_year;
                        item.applicant_identity = item.resume_baseinfo.applicant_identity;
                        item.applicant_education = item.resume_baseinfo.applicant_education;
                        item.school_name = item.resume_education.school_name;
                        item.job_duty = item.job.name;


                    })
                    this.total = res.total
                    this.applyList = Object.assign([],[],res.data);

            },
            // 投递状态更新，批量更新（单个也传递数组形式）
            async updateStatus(idArray, apply_status) {
              console.log(idArray)
                const res = await this.$axios.request({
                    url: `/user-job-applycation/updateApplyStatus`,
                    method: "post",
                    data: {
                        selectedIds: idArray,
                        status: apply_status
                    }
                })
                console.log(res);
                if(res.message === "success") {
                    this.$message.success("投递状态已更新！");
                    await this.initData();
                } else {
                    this.$message.error("投递状态更新失败！");
                }
            },
            menuSelect(name) {
                this.currentMenu = name;
            },
            industrySelect(industry) {
                this.currentIndustry = industry;
                this.getApplyList();
            },
            search() {
                console.log(this.searchKey);
            },
            // 投递职位选中
            changeJob(value) {
                this.currentJob = value;
                this.getApplyList();
            },
            // 投递时间选中
            changeDate(value) {
                this.currentStatus = value.option;
                this.getApplyList();
            },
            handleSelectionChange(applyList) {
                console.log(applyList);
                this.selectedApplyIds = Object.assign([],[],applyList.map(apply => apply.apply_id));
            },
            handleCommand(command) {
                console.log(command);
                let { row, column, key} = command;
                if (row) {
                    switch(key){
                        case this.userHandle[0].label:
                            this.updateStatus([row.apply_id], "1");
                            break;
                        case this.userHandle[1].label:
                            this.updateStatus([row.apply_id], "2");
                            break;
                        case this.userHandle[2].label:
                            this.updateStatus([row.apply_id], "3");
                            break;
                    }
                }
                if (column) {
                    column.label = key;
                    switch(key){
                        case this.secondHeader[0]:
                            this.secondLabel = key;
                            column.property = "applicant_identity";
                            break;
                        case this.secondHeader[1]:
                            this.secondLabel = key;
                            column.property = "major";
                            break;
                    }
                }
            },
            handleCurrentChange(value) {
                // console.log(value)
                this.currentPage = value;
                this.getApplyList();
            },
            viewResume(applicant_id) {
                this.selectedApplicantId = applicant_id;
                this.showResume = true;
            }
        },
    }
</script>

<style lang="less" scoped>
    .el-link-active{
        transition: .3s;
        &:hover{
            color: @mainColor;
        }
        &:active{
            color: @activeColor;
        }
    }
    .el-button-active{
        transition: .3s;
        &:hover, &:focus{
            background: @mainColor;
            border: @mainColor;
            color: #fff;
        }
        &:active{
            background: @activeColor;
            border: @activeColor;
        }
    }

    @mainColor: #5dd5c8;
    @activeColor: #00c2b3;
    @background: #fff;
    @fontColor: #414a60;
    @salaryColor: #fb670f;
    @promptColor: #8d92a1;
    @borderColor: #dcdfe6;

    main {
        padding-top: 30px;
        display: flex;
        aside {
            background: @background;
            width: 160px;
            height: fit-content;
            margin-right: 20px;
            flex-shrink: 0;
            ul li {
                font-size: 15px;
                height: 60px;
                line-height: 60px;
                position: relative;

                &.selected {
                    &::after {
                        content: "";
                        background: @activeColor;
                        width: 2px;
                        height: 18px;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }

                    .el-link {
                        color: #00d7c6;
                    }
                }

                .icon {
                    font-size: 18px;
                    margin-left: 30px;
                    margin-right: 12px;
                }

                .el-link {
                    cursor: pointer;
                    color: @fontColor;
                  .el-link-active();
                }

            }
        }
        .main-content{
            //min-width: 1188px;
            flex: 1;
            .apply{
                > div {
                    background: @background;
                    & + div{
                        margin-top: 20px;
                    }
                }
                .filter-select{
                    .filter-job-industry{
                        padding: 0 30px;
                        border-bottom: 1px solid @borderColor;
                        display: flex;
                        align-items: center;
                        ul {
                            display: inline-block;
                            li{
                                display: inline-block;
                                color: @promptColor;
                                cursor: pointer;
                                padding: 20px 0;
                                position: relative;
                                & + li{
                                    margin-left: 60px;
                                }
                                &.is-selected{
                                    &::after{
                                        content: "";
                                        display: block;
                                        width: 36px;
                                        height: 3px;
                                        border-radius: 3px;
                                        background: @fontColor;
                                        position: absolute;
                                        bottom: -3px;
                                        left: 0;
                                    }
                                    .job-industry{
                                        font-size: 18px;
                                        font-weight: 600;
                                        color: @fontColor;
                                    }
                                }
                                .job-industry{
                                    font-size: 16px;
                                }
                                .job-num{
                                    margin-left: 5px;
                                }
                            }
                        }
                        .search-input{
                            padding: 15px 0;
                            width: 239px;
                            margin-left: auto;
                            /deep/ .el-input__inner{
                                border-radius: 20px;
                            }
                            /deep/ i{
                                position: relative;
                                top: 2px;
                            }
                        }
                    }
                    .filter-condition{
                        padding: 20px 30px;
                        .condition-wrapper{
                            display: inline-block;
                            & + .condition-wrapper{
                                margin-left: 120px;
                            }
                            span{
                                font-size: 15px;
                            }
                            .select-wrapper{
                                margin-left: 10px;
                            }
                        }
                        .selected-btn{
                            float: right;
                            .el-button.is-round{
                                .el-button-active();
                            }
                        }
                    }
                }
                .apply-table{
                    padding-bottom: 60px;
                    .label{
                        margin-right: 5px;
                    }
                    .apply-applicant{
                        height: 85px;
                        line-height: 85px;
                        img{
                            float: left;
                            transform: translateY(10px);
                        }
                        p{
                            margin-left: 85px;
                            color: @promptColor;
                            .applicant_name{
                                color: @fontColor;
                                .el-link-active();
                                font-size: 18px;
                                font-weight: 600;
                            }
                        }
                    }
                    .handle{
                        i{
                            font-size: 20px;
                            cursor: pointer;
                        }
                    }
                    .page{
                        text-align: center;
                        .el-pagination{
                            margin-top: 60px;
                            /deep/ button, /deep/ li {
                                background: #fff;
                            }
                            /deep/ li{
                                &:not(.disabled):hover{
                                    color: @activeColor;
                                }
                                &:not(.disabled).active{
                                    background-color: @activeColor;
                                    color: #FFF;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .el-table{
        font-size: 16px;
        ///deep/ .cell{
        //    white-space: nowrap;
        //}
        /deep/ .el-checkbox__inner:hover{
            border-color: @activeColor;
        }
        /deep/ .el-checkbox__input.is-focus .el-checkbox__inner{
            border-color: @borderColor;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner{
            border-color: @activeColor;
            background: @activeColor;
        }
    }
</style>