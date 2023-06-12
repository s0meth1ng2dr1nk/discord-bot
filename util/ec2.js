require('dotenv').config();
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
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
  }

  static async build(instance_name) {
    const ec2 = new Ec2();
    ec2.instance_name = instance_name
    ec2.instance_id = await ec2.get_instance_id();    
    return ec2;
  } 

  async get_discribe_response() {
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
    return response;
  }

  async get_instance_id() {
    const response = await this.get_discribe_response()
    return response.Reservations[0].Instances[0].InstanceId;
  }
}

module.exports = Ec2
