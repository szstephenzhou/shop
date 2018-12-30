-- 测试数据
insert into t_product_type (name,status) values ('食品',1);
insert into t_product_type (name,status) values ('衣服',0);
insert into t_product_type (name,status) values ('数码',1);
insert into t_product_type (name,status) values ('生活用品',1);
insert into t_product_type (name,status) values ('家装',0);
insert into t_product_type (name,status) values ('旅游',1);
insert into t_product_type (name,status) values ('运动',1);
insert into t_product_type (name,status) values ('电器',1);
insert into t_product_type (name,status) values ('家居',0);
insert into t_product_type (name,status) values ('配饰',1);
insert into t_product_type (name,status) values ('裤子',1);
insert into t_product_type (name,status) values ('包包',1);
insert into t_product_type (name,status) values ('鞋子',0);
insert into t_product_type (name,status) values ('内衣',1);
insert into t_product_type (name,status) values ('裙子',1);

insert into t_role (role_name) values ('商品专员');
insert into t_role (role_name) values ('营销经理');
insert into t_role (role_name) values ('超级管理员');

insert into t_sysuser (name,login_name,password,phone,email,is_valid,create_date,role_id) values('admin','admin','123','13988888888','admin@itany.com',1,now(),3);
insert into t_sysuser (name,login_name,password,phone,email,is_valid,create_date,role_id) values('tom','tom','123','13999999999','tom@itany.com',1,now(),1);