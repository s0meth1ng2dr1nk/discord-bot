require('dotenv').config();
const { 
  EC2Client, 
  DescribeInstancesCommand, 
  StartInstancesCommand,
} = require("@aws-sdk/client-ec2");
const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}
const client = new EC2Client(config);

class Ec2 {
  constructor() {
    this.instance_name = '';
    this.instance_id = '';
    this.instance_input = '';
  }

  static async build(instance_name) {
    const ec2 = new Ec2();
    ec2.instance_name = instance_name;
    ec2.instance_id = await ec2.get_instance_id();
    ec2.instance_input = {
      "InstanceIds": [
        ec2.instance_id,
      ]
    };
    return ec2;
  } 

  async get_discribe() {
    const command = new DescribeInstancesCommand(this.instance_input);
    const response = await client.send(command);
    if (response.Reservations.length == 0) {
      throw new Error('インスタンスが存在しません')
    }
    // console.dir(response, {depth: null})
    return response.Reservations[0].Instances[0];
  }

  async get_ip() {
    const instances = await this.get_discribe();
    if (!'PublicIpAddress' in instances) {
      console.log('NOT')
      await this.get_ip()
    }
    console.log('YES')
    return instances.PublicIpAddress;
  }

  async get_instance_id() {
    const input = {
      Filters: [{
        "Name": "tag:Name",
        "Values": [
          this.instance_name
        ],
      }],
    };
    const command = new DescribeInstancesCommand(input);
    const response = await client.send(command);
    if (response.Reservations.length == 0) {
      throw new Error('インスタンスが存在しません')
    }
    if (response.Reservations[0].Instances.length > 1) {
      throw new Error('インスタンス名が被っています')
    } 
    return response.Reservations[0].Instances[0].InstanceId;
  }

  async start_instance() {
    const command = new StartInstancesCommand(this.instance_input);
    const response = await client.send(command);
    const status_code = response.$metadata.httpStatusCode
    if (status_code != 200) {
      throw new Error('インスタンスの起動に失敗しました')
    }
    const ip = await this.get_ip()
    return ip
  }
}

module.exports = Ec2
