import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CampaignUserQueryResponseDto {
  @Expose()
  id: string;

  @Expose()
  caption;

  @Expose()
  image_url;

  @Expose()
  user;

  @Expose()
  tags;

  @Expose()
  tasks;

  @Expose()
  comments;

  @Expose()
  likes;

  @Expose()
  engaged_campaigns;

  @Expose()
  budget;
}
