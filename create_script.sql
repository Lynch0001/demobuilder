DROP TABLE public.active_project ;

DROP TABLE public.admin_user ;

DROP TABLE public.archive_project ;

DROP TABLE public.project_used ;

DROP TABLE public.requested_project ;

DROP TABLE public.requestor_user ;

DROP TABLE public.segment ;


CREATE TABLE IF NOT EXISTS "active_project" (
	"id" serial NOT NULL UNIQUE,
	"project" varchar(40) NOT NULL UNIQUE,
	"segment" varchar(40) NOT NULL,
	"requestor" varchar(40) NOT NULL,
	"approver" varchar(40) NOT NULL,
	"request_date" date NOT NULL,
	"approved_date" date NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"deployed" boolean NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "requestor_user" (
	"id" serial NOT NULL UNIQUE,
	"segment" varchar(40) NOT NULL,
	"name_first" varchar(40) NOT NULL,
	"name_last" varchar(40) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(40) NOT NULL,
	"cn" varchar(40) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "admin_user" (
	"id" serial NOT NULL UNIQUE,
	"name_first" varchar(40) NOT NULL,
	"name_last" varchar(40) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(40) NOT NULL,
	"cn" varchar(40) NOT NULL UNIQUE,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "requested_project" (
	"id" serial NOT NULL UNIQUE,
	"segment" varchar(255) NOT NULL,
	"requestor" varchar(255) NOT NULL,
	"request_date" date NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"mq1_host" varchar(40),
	"mq1_port" bigint,
	"mq2_host" varchar(40),
	"mq2_port" bigint,
	"mq3_host" varchar(40),
	"mq3_port" bigint,
	"mq_flag" varchar(255),
	"inbound_sftp_pw" varchar(40),
	"inbound_sftp_key" varchar(500),
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "archive_project" (
	"id" serial NOT NULL UNIQUE,
	"project" varchar(40) NOT NULL,
	"segment" varchar(40) NOT NULL,
	"requestor" varchar(40) NOT NULL,
	"request_date" date NOT NULL,
	"approver" varchar(40) NOT NULL,
	"approve_date" date NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"delete_date" date NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "project_used" (
	"id" serial NOT NULL UNIQUE,
	"project" varchar(40) NOT NULL UNIQUE,
	"used" boolean NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "segment" (
	"id" serial NOT NULL UNIQUE,
	"name" varchar(40) NOT NULL UNIQUE,
	"inbound_sftp" boolean,
	"inbound_sftp_user" varchar(40),
	"inbound_https" boolean,
	"inbound_jms" boolean,
	"outbound_sftp" boolean,
	"outbound_https" boolean,
	"outbound_jms" boolean,
	"mq" boolean,
	"mq_hosts" bigint,
	PRIMARY KEY ("id")
);

ALTER TABLE "active_project" ADD CONSTRAINT "active_project_fk1" FOREIGN KEY ("project") REFERENCES "project_used"("project");

ALTER TABLE "active_project" ADD CONSTRAINT "active_project_fk2" FOREIGN KEY ("segment") REFERENCES "segment"("name");

ALTER TABLE "active_project" ADD CONSTRAINT "active_project_fk3" FOREIGN KEY ("requestor") REFERENCES "requestor_user"("cn");

ALTER TABLE "active_project" ADD CONSTRAINT "active_project_fk4" FOREIGN KEY ("approver") REFERENCES "admin_user"("cn");

ALTER TABLE "requestor_user" ADD CONSTRAINT "requestor_user_fk1" FOREIGN KEY ("segment") REFERENCES "segment"("name");

ALTER TABLE "requested_project" ADD CONSTRAINT "requested_project_fk1" FOREIGN KEY ("segment") REFERENCES "segment"("name");

ALTER TABLE "requested_project" ADD CONSTRAINT "requested_project_fk2" FOREIGN KEY ("requestor") REFERENCES "requestor_user"("cn");


