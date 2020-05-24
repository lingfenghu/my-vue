# Elasticsearch的简单应用,新闻文档简单过滤和管理，nginx日志集中管理
后端框架：SpringBoot整合Elasticsearch客户端<br>
前端：Vue + axios + element<br>
具体实现：手动上传txt新闻文档到ES节点，也可通过爬取网易热点新闻抓取并分析得到txt新闻文本，对文本内容出现频率大于5次的词作为文档特征搜索词，实现对文档的日期、字数范围搜索，标题、编辑、简述、来源关键字搜索,文档并可下载，对nginx日志实现实时收集，可导出excel
## my-vue 基于Elasticsearch和文本过滤的文档管理终端 [后端部分](https://github.com/lingfenghu/my-es)
### 本地运行
`npm run dev`
### 打包
`npm run build`
前端打包部署到tomcat，访问http://localhost:8080/dist
