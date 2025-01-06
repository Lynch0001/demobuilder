INSERT INTO segment (name, inbound_sftp, inbound_sftp_user, inbound_https, inbound_jms, outbound_sftp, outbound_https, outbound_jms, mq, mq_hosts)
VALUES
    ('mqn', False, null, False, False, False, False, False, True, 3  ),
    ('sftpa',  True, 'sftpa', False, False, False, False, False, False, null );

INSERT INTO requestor_user (segment, name_first, name_last, phone, email, cn)
VALUES
    ('mqn', 'john', 'doe', '861-8756', 'doej@acme.com', 'CN=Doe, John'),
    ('sftpa', 'john', 'doe', '861-8756', 'doej@acme.com', 'CN=Doe, Jim');

INSERT INTO admin_user (name_first, name_last, phone, email, cn)
VALUES ('jane', 'doe', '861-9999', 'doej2@acme.com', 'CN=Doe, Jane');

INSERT INTO project_used (project, used)
  VALUES ('alpha', False),
   ('bravo', False),
   ('charlie', False),
   ('delta', False),
   ('echo', False),
   ('foxtrot', False),
   ('golf', False),
   ('hotel', False),
   ('india', False),
   ('juliet', False),
   ('kilo', False),
   ('lima', False),
   ('november', False),
   ('oscar', False),
   ('papa', False),
   ('quebec', False),
   ('romeo', False),
   ('sierra', False),
   ('tango', False),
   ('uniform', False),
   ('victor', False),
   ('whiskey', False),
   ('xray', False),
   ('yankee', False),
   ('zulu', False);